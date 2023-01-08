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
    document.body.innerHTML = NewBillUI();

  });

  describe("When I am on NewBill Page", () => {
    test("Then it should renders NewBillPage", () => {

      // expected result
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
    })
    test("8 Fields should be rendered", () => {

      const form = document.querySelector('form');

      const formNewBill = screen.getByTestId("form-new-bill");
      const type = screen.getAllByTestId("expense-type");
      const name = screen.getAllByTestId("expense-name");
      const date = screen.getAllByTestId("datepicker");
      const amount = screen.getAllByTestId("amount");
      const vat = screen.getAllByTestId("vat");
      const pct = screen.getAllByTestId("pct");
      const commentary = screen.getAllByTestId("commentary");
      const file = screen.getAllByTestId("file");
      const submitBtn = document.querySelector("#btn-send-bill");

      expect(formNewBill).toBeTruthy();
      expect(type).toBeTruthy();
      expect(name).toBeTruthy();
      expect(date).toBeTruthy();
      expect(amount).toBeTruthy();
      expect(vat).toBeTruthy();
      expect(pct).toBeTruthy();
      expect(commentary).toBeTruthy();
      expect(file).toBeTruthy();
      expect(submitBtn).toBeTruthy();

      expect(form.length).toEqual(8)
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();

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
      expect(screen.getAllByText("L'image doit être au format jpg, jpeg ou png")).toBeTruthy()
      expect(newBillContainer.fileName).toBe(null);
      expect(newBillContainer.fileName).toBe(null);
      expect(newBillContainer.isImgFormatValid).toBe(false);
      expect(newBillContainer.formData).toBe(undefined);

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
      // expect(screen.getAllByText("L'image doit être au format jpg, jpeg ou png")).not.toBeTruthy()
      expect(newBillContainer.fileName).toBe("file.png");
      expect(getFile.files[0].name).toBe("file.png");
      expect(newBillContainer.fileName).toBe("file.png");
      expect(newBillContainer.isImgFormatValid).toBe(true);
      expect(newBillContainer.formData).not.toBe(null);
    })
  })

  describe("when i fill all the inputs correctly", () => {
    test("Then the handleSubmit function should be called and send me to the main page", () => {

      const store = {
        bills: jest.fn(() => newBillContainer.store),
        create: jest.fn(() => Promise.resolve({})),
      };

      const newBillContainer = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      })

      //TO DO : retester
      newBillContainer.isImgFormatValid = true;


      const newBillForm = screen.getByTestId('form-new-bill');
      const handleSubmit = jest.fn(newBillContainer.handleSubmit);
      newBillForm.addEventListener('submit', handleSubmit);
      fireEvent.submit(newBillForm);

      expect(handleSubmit).toHaveBeenCalled();
      // expect(screen.getAllByText('Mes notes de frais')).toBeTruthy();

    })
  })




  // describe("If i missed an input", () => {
  //   test("the form should not be submitted", () => {

  //     const newBillContainer = new NewBill({
  //       document,
  //       onNavigate,
  //       store: null,
  //       localStorage: window.localStorage,
  //     })

  //     const form = document.querySelector('form');

  //     const newBillForm = screen.getByTestId("form-new-bill");
  //     const type = screen.getAllByTestId("expense-type");
  //     const name = screen.getAllByTestId("expense-name");
  //     const date = screen.getAllByTestId("datepicker");
  //     const amount = screen.getAllByTestId("amount");
  //     const vat = screen.getAllByTestId("vat");
  //     const pct = screen.getAllByTestId("pct");
  //     const commentary = screen.getAllByTestId("commentary");
  //     const file = screen.getByTestId("file");
  //     const submitBtn = document.querySelector("#btn-send-bill");

  //     // type.addEventListener("input", "Transports")


  //     const handleSubmit = jest.fn(newBillContainer.handleSubmit);

  //     file.addEventListener('change', handleSubmit);
  //     fireEvent.change(file, {
  //       target: {
  //         files: [new File(["file.jpg"], "file.jpg", { type: "image/jpg" })],
  //       },
  //     });

  //     newBillForm.addEventListener('submit', handleSubmit);
  //     fireEvent.submit(newBillForm);

  //     expect(handleSubmit).toHaveBeenCalled();
  //     expect(screen.getAllByText('Mes notes de frais')).toBeTruthy();



  //   })

  // })

  describe("if i put the wrong file format, an error message should appear", () => {

  })

})

