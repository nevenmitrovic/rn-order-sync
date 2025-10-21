import { Toast } from "toastify-react-native";

export function createTitle(
  errorMsg: string,
  actionType: "query" | "mutation",
) {
  const action = actionType === "query" ? "fetch" : "update";
  return `could not ${action} data: ${errorMsg ?? "error connecting to server"}`;
}

export function errorHandler(title: string) {
  Toast.hide();
  Toast.error(title);
}
