/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event';
import { screen, fireEvent, getByTestId, waitFor } from "@testing-library/dom";
import mockStore from "../__mocks__/store.js";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

describe("When I am on NewBill Page", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "a@a",
      })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
  });
  //Vérification de la mise en évidence de l'icone
  test("Then mail icon on verticallayout should be highlighted", async () => {
    window.onNavigate(ROUTES_PATH.NewBill);
    await waitFor(() => screen.getByTestId("icon-mail"));
    const Icon = screen.getByTestId("icon-mail");
    expect(Icon).toHaveClass("active-icon");
  });

  describe("When I am on NewBill form", () => {
    //Vérification de l'ajout de fichier
    test("Then I add File", async () => {
      const dashboard = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });

      const handleChangeFile = jest.fn(dashboard.handleChangeFile);
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [
            new File(["document.jpg"], "document.jpg", {
              type: "document/jpg",
            }),
            new File(["document.jpeg"], "document.jpeg", {
              type: "image/jpeg",
            }),
            new File(["document.png"], "document.png", {
              type: "image/png",
            }),
          ],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(handleChangeFile).toBeCalled();
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    });
  })
  //Vérification de soumission du formulaire
  describe("When I am on NewBill page, and a user upload a accepted format file", () => {
    /*test("Then, the file name should be correctly displayed into the input and isImgFormatValid should be true or false according to the file format", () => {
      const dashboard = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });

      const handleChangeFile = jest.fn(dashboard.handleChangeFile);
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);

      // Test du cas où le fichier est au format image
      fireEvent.change(inputFile, {
        target: {
          files: [
            new File(["file.png"], "file.png", {
              type: "image/png",
            }),
          ],
        },
      });

      waitFor(() => {
        expect(handleChangeFile).toHaveBeenCalled();
        expect(inputFile.files[0].name).toBe("file.png");
        expect(dashboard.fileName).toBe("file.png");
        expect(dashboard.isImgFormatValid).toBe(true);
        expect(dashboard.formData).not.toBe(null);
      });

      // Test du cas où le fichier n'est pas au format image
      fireEvent.change(inputFile, {
        target: {
          files: [
            new File(["file.txt"], "file.txt", {
              type: "text/plain",
            }),
          ],
        },
      });

      waitFor(() => {
        expect(handleChangeFile).toHaveBeenCalled();
        expect(inputFile.files[0].name).toBe("file.txt");
        expect(dashboard.fileName).toBe("file.txt");
        expect(dashboard.isImgFormatValid).toBe(false);
        expect(dashboard.formData).toBe(null);
        expect(dashboard.isImgFormatValid).toBe(false);
      });
    });*/
    /*test("Alors, le nom du fichier doit être correctement affiché dans l'input et isImgFormatValid doit être vrai ou faux selon le format du fichier", () => {
      const dashboard = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock,
      });

      const handleChangeFile = jest.fn(dashboard.handleChangeFile);
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);

      // Test du cas où le fichier est au format image
      fireEvent.change(inputFile, {
        target: {
          files: [
            new File(["file.png"], "file.png", {
              type: "image/png",
            }),
          ],
        },
      });

      waitFor(() => {
        expect(handleChangeFile).toHaveBeenCalled();
        expect(inputFile.files[0].name).toBe("file.png");
        expect(dashboard.fileName).toBe("file.png");
        expect(dashboard.isImgFormatValid).toBe(true);
        expect(dashboard.formData).not.toBe(null);
        expect(dashboard.formData.get("file")).toBe(file);
      });

      // Test du cas où le fichier n'est pas au format image
      fireEvent.change(inputFile, {
        target: {
          files: [
            new File(["file.txt"], "file.txt", {
              type: "text/plain",
            }),
          ],
        },
      });

      waitFor(() => {
        expect(handleChangeFile).toHaveBeenCalled();
        expect(inputFile.files[0].name).toBe("file.txt");
        expect(dashboard.fileName).toBe("file.txt");
        expect(dashboard.isImgFormatValid).toBe(false);
        expect(dashboard.formData).toBe(null);
        expect(dashboard.formData.get("file")).toBe(null);
      });
    });*/
    test("Then verify there is a bill's picture", async () => {
      jest.spyOn(mockStore, "bills");

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      Object.defineProperty(window, "location", { value: { hash: ROUTES_PATH['NewBill'] } });
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }));

      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBillInit = new NewBill({
        document, onNavigate, store: mockStore, localStorage: window.localStorage
      });

      const file = new File(['image'], 'image.png', { type: 'image/png' });
      const handleChangeFile = jest.fn((e) => newBillInit.handleChangeFile(e));
      const formNewBill = screen.getByTestId("form-new-bill");
      const billFile = screen.getByTestId('file');

      billFile.addEventListener("change", handleChangeFile);
      userEvent.upload(billFile, file);

      expect(billFile.files[0].name).toBeDefined();
      expect(handleChangeFile).toBeCalled();

      const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});

/* Api */
describe("When I am on NewBill Page and submit the form", () => {
  beforeEach(() => {
    jest.spyOn(mockStore, "bills");
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "a@a",
      })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.appendChild(root);
    router();
  });
  describe("user submit form valid", () => {
    test("call api update bills", async () => {
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localeStorage: localStorageMock,
      });
      const handleSubmit = jest.fn(newBill.handleSubmit);
      const form = screen.getByTestId("form-new-bill");
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);
      expect(mockStore.bills).toHaveBeenCalled();
    });
  });
});