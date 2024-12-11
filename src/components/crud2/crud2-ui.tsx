"use client";

import { Keypair, PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import { useCrud2Program, useCrud2ProgramAccount } from "./crud2-data-access";
import { useWallet } from "@solana/wallet-adapter-react";

export function Crud2Create() {
  const { createEntry } = useCrud2Program();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { publicKey } = useWallet();

  const isFormValid = message.trim() !== "" && title.trim() !== "";
  const handleSubmit = async () => {
    if (publicKey && isFormValid) {
      try {
        await createEntry.mutateAsync({ title, message, owner: publicKey });
        console.log("entry successfull");
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (!publicKey) {
    return (
      <div className="alert alert-info">
        Connect your wallet to create a journal entry
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Message</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>
      <div className="form-control mt-6">
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={createEntry.isPending || !isFormValid}
        >
          Create
        </button>
      </div>
    </div>
  );
}

export function Crud2List() {
  const { accounts, getProgramAccount } = useCrud2Program();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={"space-y-6"}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account: any) => (
            <Crud2Card
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={"text-2xl"}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function Crud2Card({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useCrud2ProgramAccount({
    account,
  });
  const { publicKey } = useWallet();
  const [message, setMessage] = useState("");
  const title = accountQuery.data?.title;
  const isFormValid = message.trim() !== "";

  const handleSubmit = async () => {
    if (publicKey && isFormValid && title) {
      try {
        await updateEntry.mutateAsync({ title, message, owner: publicKey });
        console.log("entry update");
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (!publicKey) {
    return (
      <div className="alert alert-info">
        Connect your wallet to create a journal entry
      </div>
    );
  }

  if (accountQuery.isLoading) {
    return <div className="alert alert-info">Loading...</div>;
  }

  return (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body">
        <h2
          className="card-title justify-center text-xl cursor-pointer"
          onClick={() => accountQuery.refetch()}
        >
          {accountQuery.data?.title}
        </h2>
        <p>{accountQuery.data?.message}</p>

        <div className="card-actions justify-end">
          <textarea
            placeholder="message"
            className="textarea textarea-bordered w-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={updateEntry.isPending || !isFormValid}
          >
            Update journalEntry
          </button>

          <button
            onClick={() => {
              const title = accountQuery.data?.title;
              if (title) {
                return deleteEntry.mutateAsync(title);
              }
            }}
            className="btn btn-error"
            disabled={deleteEntry.isPending}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
