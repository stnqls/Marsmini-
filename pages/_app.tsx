import type { AppProps } from "next/app";
import { init as fireabseInit } from "../firebase";
import "../styles/styles.scss";

fireabseInit();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div id="npasApp">
      <Component {...pageProps} />
    </div>
  );
};

export default MyApp;
