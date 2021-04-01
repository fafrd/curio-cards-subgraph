# Curio Cards subgraph

This is a subgraph (index) of all [Curio Cards](https://curio.cards) holdings.

## How the indexing works

First, take a look at schema.graphql. This defines the datatypes stored as a result of the indexing. `CardHolder` is the main type, it contains the id (address) and holdings (as an array of `CardBalances`). `CardBalances` is a simple pair between card # and the balance thereof.

The indexing logic then happens in src/mappings.ts. `handleTransferSingle` fires in response to the contract emitting a `TransferSingle` event. It will calculate the updated card holdings for the sender and recipient and call `.save()` to store these updated entries.

## How to use the api

### Querying all holdings for a specific address

query:
```
{
  cardHolders(where: { id: "0x010edafa8a3c464413a680a1f6a7115b4ee4c74d" }) {
    id
    holdings {
      cardNumber
      balance
    }
  }
}
```
response:
```
{
  "data": {
    "cardHolders": [
      {
        "holdings": [
          {
            "balance": "2",
            "cardNumber": "13"
          },
          {
            "balance": "1",
            "cardNumber": "26"
          },
          {
            "balance": "2",
            "cardNumber": "9"
          }
        ],
        "id": "0x010edafa8a3c464413a680a1f6a7115b4ee4c74d"
      }
    ]
  }
}
```

### Querying all holders who hold >25 unique cards

query:
```
{
  cardHolders(where: { uniqueCards_gt: 25 }) {
    id
    uniqueCards
  }
}
```
response:
```
{
  "data": {
    "cardHolders": [
      {
        "id": "0x518e5a942ed7db4b45e9a491ce318373346db240",
        "uniqueCards": 30
      },
      {
        "id": "0x53d7b6b2fab64f797e635af3dfc0125d46f04a15",
        "uniqueCards": 30
      },
      {
        "id": "0x53f46bfbecb075b4feb3bce6828b9095e630d371",
        "uniqueCards": 30
      },
      {
        "id": "0x97575aac6912233403e9b8935e980dec40c55548",
        "uniqueCards": 27
      },
      {
        "id": "0xb9d9baa174702596fac7adcab58325c741f2ea6b",
        "uniqueCards": 30
      },
      {
        "id": "0xd402514d2fec96df7294cc53cfbe756e5b761f03",
        "uniqueCards": 29
      },
      {
        "id": "0xe6a9d0539fabe0fda237c3c4bafeae2042b06e67",
        "uniqueCards": 30
      }
    ]
  }
}
```
