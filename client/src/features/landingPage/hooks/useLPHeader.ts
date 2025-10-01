import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"

export const useLPHeader = () => {

    const username = useSelector ((state: RootState) => state.login.username)
  return {username};
}
