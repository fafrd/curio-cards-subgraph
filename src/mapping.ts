import { BigInt } from "@graphprotocol/graph-ts"
import { CurioERC1155Wrapper, TransferSingle, TransferBatch } from "../generated/CurioERC1155Wrapper/CurioERC1155Wrapper"
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { CardHolder, CardBalance } from "../generated/schema"

export function handleTransferSingle(event: TransferSingle): void {
  /*
   *  Increment balance of recipient
   */

  // try to load recipient CardBalance. if null, create a new recipient
  if (event.params._to.toHex() != "0x0000000000000000000000000000000000000000"
     && event.params._from.toHex() != "0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313") {
    let newBalanceId_recipient = event.params._to.toHex() + "-" + event.params._id.toString();
    let newBalance_recipient = CardBalance.load(newBalanceId_recipient);
    if (newBalance_recipient == null) {
      newBalance_recipient = new CardBalance(newBalanceId_recipient);
      newBalance_recipient.cardNumber = event.params._id;
      newBalance_recipient.balance = event.params._value;
      newBalance_recipient.save();
    } else {
      newBalance_recipient.balance += event.params._value;
      newBalance_recipient.save();
    }

    // try to load recipient CardHolder. if null, create a new recipient
    let cardHolder_recipient = CardHolder.load(event.params._to.toHex())
    if (cardHolder_recipient == null) {
      cardHolder_recipient = new CardHolder(event.params._to.toHex());
      cardHolder_recipient.holdings = [newBalance_recipient.id];
    } else {
      // if balance not in cardHolder_recipient, add it
      if (cardHolder_recipient.holdings.indexOf(newBalance_recipient.id) == -1) {
        let newHoldings = cardHolder_recipient.holdings;
        newHoldings.push(newBalance_recipient.id);
        cardHolder_recipient.holdings = newHoldings;
      }
    }

    // calculate number of unique cards
    cardHolder_recipient.uniqueCards = cardHolder_recipient.holdings.length;

    cardHolder_recipient.save();
  }

  /*
   *  Decrement balance of sender
   */
  if (event.params._from.toHex() != "0x0000000000000000000000000000000000000000"
     && event.params._from.toHex() != "0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313") {
    // load CardBalance
    let newBalanceId_sender = event.params._from.toHex() + "-" + event.params._id.toString();
    let newBalance_sender = CardBalance.load(newBalanceId_sender);
    if (newBalance_sender == null) {
      throw "should never happen"
    } else {
      newBalance_sender.balance -= event.params._value;
      newBalance_sender.save();
    }

    // load sender CardHolder
    let cardHolder_sender = CardHolder.load(event.params._from.toHex())
    if (cardHolder_sender == null) {
      throw "should never happen"
    } else {
      // if balance not in cardHolder_sender, add it
      if (cardHolder_sender.holdings.indexOf(newBalance_sender.id) == -1) {
        let newHoldings = cardHolder_sender.holdings;
        newHoldings.push(newBalance_sender.id);
        cardHolder_sender.holdings = newHoldings;
      }
    }

    // calculate number of unique cards
    cardHolder_sender.uniqueCards = cardHolder_sender.holdings.length;

    cardHolder_sender.save();
  }

}

export function handleTransferBatch(event: TransferBatch): void {
  /*
   *  Increment balance of recipient
   */

  if (event.params._to.toHex() != "0x0000000000000000000000000000000000000000"
     && event.params._from.toHex() != "0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313") {
    // try to load CardBalances. if null, create new recipients
    let newBalanceList: Array<String> = [];
    for (let i = 0; i < event.params._ids.length; i++) {
      let newBalanceId_recipient = event.params._to.toHex() + "-" + (event.params._ids as Array<BigInt>)[i].toString();
      let newBalance_recipient = CardBalance.load(newBalanceId_recipient);
      if (newBalance_recipient == null) {
        newBalance_recipient = new CardBalance(newBalanceId_recipient);
        newBalance_recipient.cardNumber = (event.params._ids as Array<BigInt>)[i];
        newBalance_recipient.balance = (event.params._values as Array<BigInt>)[i];
        newBalance_recipient.save();
      } else {
        newBalance_recipient.balance += (event.params._values as Array<BigInt>)[i];
        newBalance_recipient.save();
      }
      newBalanceList.push(newBalance_recipient.id);
    }

    // try to load recipient CardHolder. if null, create a new recipient
    let cardHolder_recipient = CardHolder.load(event.params._to.toHex())
    if (cardHolder_recipient == null) {
      cardHolder_recipient = new CardHolder(event.params._to.toHex());
      cardHolder_recipient.holdings = newBalanceList;
    } else {
      // if balance not in cardHolder_recipient, add it
      for (let i = 0; i < event.params._ids.length; i++) {
        if (cardHolder_recipient.holdings.indexOf(newBalanceList[i]) == -1) {
          let newHoldings = cardHolder_recipient.holdings;
          newHoldings.push(newBalanceList[i]);
          cardHolder_recipient.holdings = newHoldings;
        }
      }
    }

    // calculate number of unique cards
    cardHolder_recipient.uniqueCards = cardHolder_recipient.holdings.length;

    cardHolder_recipient.save();
  }

  /*
   *  Decrement balance of sender
   */

  if (event.params._from.toHex() != "0x0000000000000000000000000000000000000000"
     && event.params._from.toHex() != "0x73da73ef3a6982109c4d5bdb0db9dd3e3783f313") {
    // load CardBalances
    let newBalanceList: Array<String> = [];
    for (let i = 0; i < event.params._ids.length; i++) {
      let newBalanceId_sender = event.params._from.toHex() + "-" + (event.params._ids as Array<BigInt>)[i].toString();
      let newBalance_sender = CardBalance.load(newBalanceId_sender);
      if (newBalance_sender == null) {
        throw "should never happen"
      } else {
        newBalance_sender.balance -= (event.params._values as Array<BigInt>)[i];
        newBalance_sender.save();
      }
      newBalanceList.push(newBalance_sender.id);
    }

    // load sender CardHolder
    let cardHolder_sender = CardHolder.load(event.params._from.toHex())
    if (cardHolder_sender == null) {
      throw "should never happen"
    } else {
      // if balance not in cardHolder_sender, add it
      for (let i = 0; i < event.params._ids.length; i++) {
        if (cardHolder_sender.holdings.indexOf(newBalanceList[i]) == -1) {
          let newHoldings = cardHolder_sender.holdings;
          newHoldings.push(newBalanceList[i]);
          cardHolder_sender.holdings = newHoldings;
        }
      }
    }

    // calculate number of unique cards
    cardHolder_sender.uniqueCards = cardHolder_sender.holdings.length;

    cardHolder_sender.save();
  }

}
