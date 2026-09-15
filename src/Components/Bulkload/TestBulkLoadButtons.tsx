import {
  useState,
} from "react";

import type {
  ChangeEvent,
} from "react";

import axios from "axios";


// ========================================
// COMPONENT
// ========================================

const BulkLoadButtons = () => {
  // ========================================
  // FILE STATE
  // ========================================

  /*
   * TypeScript:
   * Before the user chooses an Excel file,
   * the value is null.
   *
   * After selection it becomes a browser File object.
   */
  const [
    file,
    setFile,
  ] = useState<File | null>(
    null
  );


  // ========================================
  // LOADING STATE
  // ========================================

  /*
   * Used to disable the upload button while
   * the request is running.
   */
  const [
    loading,
    setLoading,
  ] = useState<boolean>(
    false
  );


  // ========================================
  // DOWNLOAD EXCEL TEMPLATE
  // ========================================

  const downloadTemplate =
    (): void => {
      try {
        window.open(
          "http://localhost:8001/api/excel/template",
          "_blank"
        );
      } catch (
        error: unknown
      ) {
        alert(
          "Download failed"
        );

        console.error(
          "Template download error:",
          error
        );
      }
    };


  // ========================================
  // FILE CHANGE
  // ========================================

  const handleFileChange = (
    event:
      ChangeEvent<HTMLInputElement>
  ): void => {
    /*
     * files may be null if the user cancels
     * the file picker.
     */
    const selectedFile =
      event.target.files?.[0] ??
      null;


    setFile(
      selectedFile
    );
  };


  // ========================================
  // UPLOAD UPDATED EXCEL
  // ========================================

  const uploadExcel =
    async (): Promise<void> => {
      /*
       * FormData.append() requires a real File/Blob.
       * Prevent upload if no file has been selected.
       */
      if (!file) {
        alert(
          "Please select a file first"
        );

        return;
      }


      try {
        setLoading(
          true
        );


        const formData =
          new FormData();


        /*
         * "file" must match the backend
         * multer field name.
         */
        formData.append(
          "file",
          file
        );


        /*
         * Do not manually set multipart/form-data.
         *
         * Axios/browser will automatically attach
         * the required multipart boundary.
         */
        const response =
          await axios.post(
            "http://localhost:8001/api/excel/import",
            formData
          );


        console.log(
          "Excel upload response:",
          response.data
        );


        alert(
          "Uploaded successfully!"
        );
      } catch (
        error: unknown
      ) {
        /*
         * TypeScript:
         * catch values are unknown, so narrow
         * Axios errors before reading Axios fields.
         */
        if (
          axios.isAxiosError(
            error
          )
        ) {
          console.error(
            "Excel upload failed:",
            error.response?.data ??
              error.message
          );
        } else {
          console.error(
            "Excel upload failed:",
            error
          );
        }


        alert(
          "Upload failed"
        );
      } finally {
        /*
         * Always restore the button even when
         * the upload request fails.
         */
        setLoading(
          false
        );
      }
    };


  return (
    <div className="d-flex flex-column justify-content-center align-items-center gap-2">
      <h1>
        Excel Import
      </h1>


      {/* ========================================
          DOWNLOAD TEMPLATE
      ======================================== */}

      <button
        type="button"
        onClick={
          downloadTemplate
        }
      >
        Download Excel Template
      </button>


      <br />


      {/* ========================================
          SELECT FILE
      ======================================== */}

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={
          handleFileChange
        }
      />


      {/* ========================================
          UPLOAD FILE
      ======================================== */}

      <button
        type="button"
        onClick={() =>
          void uploadExcel()
        }
        disabled={
          loading
        }
      >
        {loading
          ? "Updating ..."
          : "Upload Updated Excel"}
      </button>
    </div>
  );
};

export default BulkLoadButtons;