import React from "react";
import { act } from "react-dom/test-utils";
import Enzyme, {shallow, mount} from "enzyme";
import NameForm from "../components/student/NameForm";
import Adapter from "enzyme-adapter-react-16"
import sinon from "sinon"; 
import {Form} from "formik";

Enzyme.configure({adapter: new Adapter()});

describe("NameForm component", () => {
    let wrapper;
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, "useState")
    useStateSpy.mockImplementation((init) => [init, setState]);
    const wait = (number) => new Promise((resolve, reject) => {setTimeout(() => {resolve(number)}, number)})

    const validNick = 'nick';
    const validBadge = 66666;
    const invalidNick = 'n';
    const invalidBadge = '8n8';

    const updateField = (wrapper, tname, tvalue) => {
        wrapper.simulate('change', {
                persist: () => {},
                target: {
                    name: tname,
                    value: tvalue,
                },
        })
    }

    const submitForm = async (wrapper) => {
        await act(async () => {
          wrapper.simulate(
            'submit',
            { preventDefault: () => {} }
          );
        });
      }
    

    beforeEach(async () => {
        wrapper = Enzyme.mount(Enzyme.shallow(<NameForm />).get(0))
        sessionStorage.clear();
        sessionStorage.setItem.mockClear();
    })

    afterEach(() => {
        wrapper.unmount();
        jest.clearAllMocks();
    })

    it("Component should render", () => {
        expect(wrapper.exists()).toBe(true)
    })

    it ("Component should render without error messages", () => {
        expect(wrapper.find('Field').at(0).hasClass('error')).toEqual(false)
    })

    it("Component should display two form fields", () => {
        expect(wrapper.find('Field').at(0)).toBeTruthy()
        expect(wrapper.find('Field').at(1)).toBeTruthy()
    })

    it("Should capture nickname correctly onChange", () => {
        updateField(wrapper.find('Field').at(0), 'nickname', validNick)
        const newValue = wrapper.find('Field').at(0).props().value;

        expect(newValue).toEqual(validNick)
    })

    it("Should capture badge correctly onChange", () => {
        updateField(wrapper.find('Field').at(1), 'badge', validBadge)
        const newValue = wrapper.find('Field').at(1).props().value;

        expect(newValue).toEqual(validBadge)
       
    })

    it('Should show error with invalid nickname input field on blur', async () => {
        const field = wrapper.find('Field').at(0);
        field.simulate('focus')
        updateField(field, 'nickname', invalidNick)

        field.simulate('blur', {target: {name: 'nickname', value: invalidNick}})

        await wait(1)
        wrapper.update()

        expect(wrapper.find('Field').at(0).props().value).toEqual(invalidNick)
        expect(wrapper.find('Field').at(0).hasClass('error')).toEqual(true)
        expect(wrapper.exists('.invalidNickName')).toEqual(true)
      })


    it('Should trigger submit with proper nick & badge when button is clicked', async () => {

        updateField(wrapper.find('Field').at(0), 'nickname', validNick)
        updateField(wrapper.find('Field').at(1), 'badge', validBadge)

        const form = wrapper.find('Form')

        await submitForm(form)
        
        expect(sessionStorage.setItem).toHaveBeenCalledWith('badge', validBadge);
      })

    it('Should NOT trigger submit when button is clicked if nick & badge are invalid', async () => {
        updateField(wrapper.find('Field').at(0), 'nickname', invalidNick)
        updateField(wrapper.find('Field').at(1), 'badge', invalidBadge)

        const form = wrapper.find('form')

        await submitForm(form)

        expect(sessionStorage.setItem).not.toHaveBeenCalled();
      })
})

/*

When student enters a nickname and presses submit -button, nickname is saved into session storage
When student enters teachers badge and presses submit, badge is sent to database
If backend replies with "true", student is pushed into quiz-component
If badge does not exists, an error message is displayed
If badge does not exists, previously submitted nickname is collected from session storage and displayed as a placeholder and input value
On submit form sends both input values into the database
Component is able to collect nickname from sessionstorage upon student entering wrong teacher number
Validation: both input values must be filled
Validation: Nickname cannot be shorter than 3 characters
Validation: Nickname cannot be longer than 20 characters
Validation: teacher badge must contain esactly 5 numbers and no other characters
*/
