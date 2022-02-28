const express = require("express");
const router = express.Router();
const { Trades, Auctions, Items, Users } = require("../models");

// GET Buyer Trade list
router.get("/buyer/:id", async (req, res) => {
  const userId = req.params.id
  var step = 0;
  var len = 0;
  var BuyList = [];

  const placeData = (name, Current, Account) =>{
    const buyerdata = {
      item_name: name,
      price: Current,
      account: Account,
    };
    BuyList.push(buyerdata);
  }

  const AuctionIDList = await Trades.findAll({
    attributes: ['AuctionId'],
    where: { buyer_id: userId,}
  })// pull out every auctionid that user bought

  if (AuctionIDList.length == 0)
  {
    BuyList = [];
    res.json(BuyList);
  } else {
    len = AuctionIDList.length;
    for(step = 0; step < len; step ++){
      var Name = await Items.findAll({
        attributes: ['name'],
        where:{ AuctionId: AuctionIDList[step].AuctionId}
      })
      var Current = await Trades.findAll({
        attributes: ['price'],
        where:{AuctionId: AuctionIDList[step].AuctionId}
      })
      var Seller_id = await Trades.findAll({
        attributes: ['seller_id'],
        where: {AuctionId: AuctionIDList[step].AuctionId}
      })
      var Account = await Users.findAll({
        attributes: ['account'],
        where:{ id: Seller_id[0].seller_id}
      })
      placeData(Name[0].name, Current[0].price, Account[0].account);
      console.log("buyer Tradelist", BuyList);
    }
    res.json(BuyList);
  }
});

// GET Seller Trade list
router.get("/seller/:id", async (req, res) => {
  const userId = req.params.id
  var step = 0;
  var len = 0;
  var SellList = [];

  const placeData = (name, Current, Address) =>{
    const sellerdata = {
      item_name: name,
      price: Current,
      address: Address,
    };
    SellList.push(sellerdata);
  }

  const AuctionIDList = await Trades.findAll({
    attributes: ['AuctionId'],
    where: { seller_id: userId,}
  }) // pull out every auctionid that user bought
  

  if (AuctionIDList.length == 0)
  {
    BuyList = [];
    res.json(BuyList);
  }else {
    len = AuctionIDList.length;
    for(step = 0; step < len; step ++){
      var Name = await Items.findAll({
        attributes: ['name'],
        where:{ AuctionId: AuctionIDList[step].AuctionId}
      })
      var Current = await Trades.findAll({
        attributes: ['price'],
        where:{ AuctionId: AuctionIDList[step].AuctionId}
      })
      var Buyer_id = await Trades.findAll({
        attributes: ['buyer_id'],
        where: {AuctionId: AuctionIDList[step].AuctionId}
      })
      var Address = await Users.findAll({
        attributes: ['address'],
        where:{ id: Buyer_id[0].buyer_id}
      })
      placeData(Name[0].name, Current[0].price, Address[0].address);
      console.log("buyer Tradelist", SellList);
    }
    res.json(SellList);
  }
});

// GET Seller Trade list
router.get("/seller/:id", async (req, res) => {
  const userId = req.params.id
  const listOfTrades = await Trades.findAll({
      where: {
          seller_id: userId,
      }
  })
  res.json(listOfTrades);
});

module.exports = router;
