/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { handleClickNewBill } from "../containers/Bills.js"
import Bills from "../containers/Bills.js";


import router from "../app/Router.js";

const data = []
const loading = false
const error = null

//Init Navigate
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
};

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    beforeEach(() => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
    })

    test("Then bill icon in vertical layout should be highlighted", async () => {
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then clicking on the eye should open the modal", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })

      const modale = document.getElementById("modaleFile");
      $.fn.modal = jest.fn(() => modale.classList.add("show"));
      const eye = screen.getAllByTestId("icon-eye")[0]
      userEvent.click(eye)
      expect(screen.getAllByText("Justificatif"))

    })


    test("Then clicking on the NewBill button should open the newBill page", async () => {
      document.body.innerHTML = BillsUI({ data: bills })
      new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })
      const btn = screen.getByTestId("btn-new-bill")
      userEvent.click(btn)
      const sendNewBill = await waitFor(() => screen.getAllByText("Envoyer une note de frais"))
      expect(sendNewBill).toBeTruthy()
    })
  })
})
