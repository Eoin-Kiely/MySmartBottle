import "@testing-library/jest-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../Services/firebase";

test("successfull login with email and password", async () => {
  const user = await signInWithEmailAndPassword(auth, 'unit-test@gmail.com', '123456789')
  expect(user.user).toBeTruthy();
  let loggedIn = auth.currentUser;
  expect(loggedIn).toBeTruthy();
  await signOut(auth);
})

test("unsuccesfull login with email and password (wrong password)", async () => {
  let error = '';
  try {
    await signInWithEmailAndPassword(auth, "unit-test@gmail.com", "2343");
  } catch(err) {
    error = err.toString();
  }

  expect(error).toEqual('FirebaseError: Firebase: Error (auth/wrong-password).')
})

test("unsuccesfull login with email and password (no account)", async () => {
  let error = '';
  try {
    await signInWithEmailAndPassword(auth, "unit-test1@gmail.com", "2343");
  } catch(err) {
    error = err.toString();
  }

  expect(error).toEqual('FirebaseError: Firebase: Error (auth/user-not-found).')
})