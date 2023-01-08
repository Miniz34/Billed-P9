/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import BillsUI from '../views/BillsUI.js';

import mockedBills from "../__mocks__/store.js"
import mockStore from "../__mocks__/store";

import { localStorageMock } from '../__mocks__/localStorage.js';
import { ROUTES } from '../constants/routes';


//Init Navigate
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
};

describe("Given I am connected as an employee", () => {
  //Setup localStorage


  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        type: 'Employee',
      })
    );
    document.body.innerHTML = NewBillUI()
  });

  describe("When I am on NewBill Page", () => {
    test("Then it should renders NewBillPage", () => {

      // expected result
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
    })
    test("9 Fields should be rendered", () => {
      document.body.innerHTML = NewBillUI()
      const form = document.querySelector('form');
      expect(form.length).toEqual(8)
    })
  })

  describe("when i fill all the inputs correctly", () => {
    test("Then i should be sent to the mainPage", () => {
      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })

      const handleSubmit = jest.fn(newBillContainer.handleSubmit);
      const newBillForm = screen.getByTestId('form-new-bill');
      newBillForm.addEventListener('submit', handleSubmit);
      fireEvent.submit(newBillForm);

      expect(handleSubmit).toHaveBeenCalled();
      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy();

    })
  })

  describe("if i put the right file format", () => {
    test("Then the function handleChangeFile should be called", () => {
      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })

      const handleFile = jest.fn(() => newBillContainer.handleChangeFile)
      const getFile = screen.getByTestId('file');
      getFile.addEventListener('change', handleFile);
      fireEvent.change(getFile, {
        target: {
          files: [new File(['file.jpg'], 'file.jpg', { type: 'image/jpg' })],
        },
      });

      // const numberOfFile = screen.getByTestId('file').files.length;
      // expect(numberOfFile).toEqual(1);

      expect(handleFile).toHaveBeenCalled();
    })

  })

  describe("If i add the wrong format of image,", () => {
    test("Then the error message should be displayed", () => {
      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })
      const handleFile = jest.fn(() => newBillContainer.handleChangeFile)
      const getFile = screen.getByTestId('file');
      getFile.addEventListener('change', handleFile);
      fireEvent.change(getFile, {
        target: {
          files: [new File(['file.pdf'], 'file.pdf', { type: 'image/pdf' })]
        },
      });
      expect(handleFile).toHaveBeenCalled()
      // expect(document.querySelector(".error-extensionFile").innerText).toBe("Votre justificatif doit être une image de format (.jpg) ou (.jpeg) ou (.png)")
      expect(screen.getAllByText("L'image doit être au format jpg, jpeg ou png")).toBeTruthy()
      // expect(newBillContainer.formData).toBe(null);
      // expect(document.querySelector(`input[data-testid="file"]`).value).toBe(null)
      // expect(newBillContainer.formData).toBe(null)
      // jest.spyOn(window, "alert");
      // expect(alert).toHaveBeenCalled();
      expect(newBillContainer.fileName).toBe(null);

    })

  })

  describe("If i add the right format of image", () => {
    test("The error message should not be displayed", () => {

      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })

      const handleFile = jest.fn(() => newBillContainer.handleChangeFile)
      const getFile = screen.getByTestId('file');
      getFile.addEventListener('change', handleFile);
      fireEvent.change(getFile, {
        target: {
          files: [new File(["file.png"], "file.png", { type: "image/png" })],
        },
      });
      expect(handleFile).toHaveBeenCalled()
      // expect(document.querySelector(".error-extensionFile").innerText).toBe("")
      // expect(document.querySelector(`input[data-testid="file"]`).value).toBe(null)

      // expect(screen.getAllByText("L'image doit être au format jpg, jpeg ou png")).not.toBeTruthy()
      // expect(getFile.files[0].name).toBe("file.jpg");
      // expect(newBillContainer.formData).toBe(null);
      // jest.spyOn(window, "alert");
      // expect(alert).not.toHaveBeenCalled();
      expect(newBillContainer.fileName).toBe("file.png");


    })

  })


  describe("If i missed an input, an error message should appear", () => {

  })

  describe("if i put the wrong file format, an error message should appear", () => {

  })

})

