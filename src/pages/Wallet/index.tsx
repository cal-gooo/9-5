import { init, Button } from "@getalby/bitcoin-connect-react";
export default function Wallet() {
  init({
    appName: "9-5", // your app name
    providerConfig: {
      nwc: {
        authorizationUrlOptions: {
          requestMethods: [
            "get_balance",
            "make_invoice",
            "lookup_invoice",
            "list_transactions",
          ],
        },
      },
    },
  });

  return (
    <div
      className={
        "flex flex-col items-center justify-center h-dvh text-2xl px-10"
      }
    >
      <Button
        onConnected={async (provider) => {
          const balance = await provider.getBalance();
          console.debug("Connected to wallet:", provider, balance);
        }}
      />
    </div>
  );
}
