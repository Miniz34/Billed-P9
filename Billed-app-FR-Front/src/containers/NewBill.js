import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"
import NewBillUI from "../views/NewBillUI.js"
import { formatDate } from '../app/format.js';


export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`);
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate });
  }
  handleChangeFile = (e) => {
    e.preventDefault();
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0];
    if (!file) return false;

    const fileName = file.name;
    // new variables needed to check image format
    const fileInput = this.document.querySelector(`input[data-testid="file"]`);
    const fileAcceptedFormats = ["jpg", "jpeg", "png"];
    const fileNameParts = fileName.split(".");
    const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
    // const error = this.document.querySelector(`form[data-testid="fileFormat-errorMessage"]`)
    const error = this.document.querySelector(`.error-extensionFile`)

    console.log(error)

    this.isImgFormatValid = false;
    // if there are at least two pieces to the file name, continue the check
    // Check if image format is .jpg, jpeg or png - if true set isImgFormatValid to true else false
    if (fileNameParts.length > 1 && fileAcceptedFormats.indexOf(fileExtension) !== -1) {
      this.isImgFormatValid = true;
      // if image format is valid ...
      fileInput.classList.remove("is-invalid"); // ... remove is-invalid class
      fileInput.classList.add("blue-border"); // ... add blue-border class
      error.style.display = "none" // ... hide error msg

      const formData = new FormData();
      const email = JSON.parse(localStorage.getItem("user")).email;
      formData.append("file", file);
      formData.append("email", email);
      this.formData = formData; // so it can be used in other methods
      this.fileName = fileName;
      return true
    } else {
      // if image format is not valid ...
      fileInput.value = ""; // ... remove file from the input
      fileInput.classList.add("is-invalid"); // ... add is-invalid class to tell user input is invalid
      fileInput.classList.remove("blue-border"); // ... remove blue-border class
      error.style.display = "block" // ... add error msg
      alert("Le format de votre fichier n'est pas pris en charge." + "\n" + "Seuls les .jpg, .jpeg, .png sont acceptés."); // Error message for user
      return false
    }

  };

  handleSubmit = e => {
    e.preventDefault()
    // if image format is valid ...
    if (this.isImgFormatValid) {
      const email = JSON.parse(localStorage.getItem("user")).email
      const bill = {
        email,
        type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
        name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
        amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
        date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
        vat: e.target.querySelector(`input[data-testid="vat"]`).value,
        pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
        commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
        fileUrl: this.fileUrl,
        fileName: this.fileName,
        status: 'pending'
      }
      console.log(bill.date)

      // ... move in handleSubmit to upload image and create new bill only when image format is valid and form is complete
      this.store
        .bills()
        .create({
          data: this.formData,
          headers: {
            noContentType: true,
          },
        })
        .then(({ fileUrl, key }) => {
          console.log(fileUrl);
          this.billId = key;
          this.fileUrl = fileUrl;
        })
        .then(() => {
          this.updateBill(bill);
        })
      // .catch((error) => console.error(error));
    }


    // this.updateBill(bill)
    // this.onNavigate(ROUTES_PATH['Bills'])


  }

  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH['Bills'])
        })
        .catch(error => console.error(error))
    }
  }
}

