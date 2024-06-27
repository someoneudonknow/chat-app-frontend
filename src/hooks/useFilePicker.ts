import { useCallback, useEffect, useRef, useState } from "react";

type UseFilePickerProps = {
  accept?: string;
  multiple?: boolean;
  onChange?: (fileList: FileList | null) => void;
  validator?: (file: File[]) => boolean | string;
};

const useFilePicker = ({
  accept = "*",
  multiple = false,
  validator,
  onChange,
}: UseFilePickerProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const fileInput = document.createElement("input");

    fileInput.type = "file";
    fileInput.accept = accept;
    fileInput.multiple = multiple;
    fileInput.hidden = true;

    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;

      if (validator) {
        const fileError = validator && files && validator(Array.from(files));

        if (typeof fileError === "boolean" && fileError) {
          onChange && onChange(files);
          setSelectedFiles(files);
          setError(null);
        } else if (typeof fileError === "string") {
          setError(fileError);
        }
      } else {
        onChange && onChange(files);
        setSelectedFiles(files);
      }
      target.files = null;
    };

    document.body.appendChild(fileInput);

    fileInputRef.current = fileInput;

    return () => {
      fileInputRef.current?.remove();
    };
  }, [multiple, accept]);

  const reValidate = useCallback(() => {
    if (validator) {
      const fileError =
        validator && selectedFiles && validator(Array.from(selectedFiles));

      if (typeof fileError === "boolean" && fileError) {
        setError(null);
      } else if (typeof fileError === "string") {
        setError(fileError);
      }
    }
  }, [selectedFiles, validator]);

  const openDialog = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const reset = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.files = null;
      fileInputRef.current.value = "";
    }
  }, []);

  return { openDialog, selectedFiles, error, reValidate, reset };
};

export default useFilePicker;
