import { BigInt } from "@graphprotocol/graph-ts"
import { CurioERC1155Wrapper, TransferSingle, TransferBatch } from "../generated/CurioERC1155Wrapper/CurioERC1155Wrapper"
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { CardHolder, CardBalance } from "../generated/schema"

export function handleTransferSingle(event: TransferSingle): void {
  let cardHolder = CardHolder.load(event.params._from.toHex())
  let balances: Array<String>;

  let currentBalance = new CardBalance(event.params._id.toString());
  currentBalance.balance = event.params._value;
  currentBalance.save();

  // TODO: found a big bug. 'ID' needs to be globally unique. that means here, ID should be
  //       something like address-cardid.
  //       To maintain the ability to query by id, we'll need to implement another field-
  //       let's call it cardId?

  if (cardHolder == null) {
    cardHolder = new CardHolder(event.params._from.toHex());
    balances = [currentBalance.id];
  } else {
    balances = cardHolder.holdings;

    // TODO if balance already exists, increment value
    if () {
      // load balance
      // increment
      // save
    } else {
      balances.push(currentBalance.id);
    }
  }

  cardHolder.holdings = balances;
  cardHolder.save();

  // TODO i switched from/to above. switch to 'to'. implement from below.
}

export function handleTransferBatch(event: TransferBatch): void {}
