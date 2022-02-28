const express = require("express");
const router = express.Router();
const { Auctions, Items, UserOpens, Bids, Schedules } = require("../models");

// GET Auction data
router.get("/byId/:id", async (req, res) => {
    const id = req.params.id;
    const item = await Items.findAll({
        where:{
            AuctionId: id,
        }
    })
    console.log(item);
    const schedule = await Schedules.findAll({
        where:{
            AuctionId: id,
        }
    })
    console.log(item);
    //findAll datatype = []
    const auction = await Auctions.findByPk(id);
   
    const buffer = {
        seller_id: auction.UserId,
        auction_current: auction.current,
        start: schedule[0].start,
        end: schedule[0].end,
        item_name: item[0].name, 
        item_description: item[0].description,
    }
    console.log("\nbuffer:",buffer,"\n\n");
    res.json(buffer);
});

// GET Auction list
router.get("/", async (req, res) => {
    const listOfAuctions = await Auctions.findAll({
        where: {
            status: 'open'
        }
    })
    res.json(listOfAuctions);
});


// POST New Auction
router.post("/open/:id", async (req, res) => {
    const userid = req.params.id;
    console.log("\nrecieved id:"+req.params.id);

    const item = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        AuctionId: ""
    }
    const auction = {
        reserve: req.body.reserve,
        current: req.body.current,
        UserId: userid
    }

    post_auction = await Auctions.create(auction);
    item.AuctionId = post_auction.id;
    
    post_openauction = await UserOpens.create({
        UserId: userid,
        AuctionId: post_auction.id,
    });
    
    post_item = await Items.create(item);
    post_schedule = await Schedules.create({
        AuctionId: post_auction.id,
    });

    res.json(post_auction);
});

// GET Auction list for specific userid
router.get("/auctionlist/:userId", async (req, res) => {
    const userId = req.params.userId;
    const listOfAuctions = await Auctions.findAll({
        where: {UserId: userId}
    })
    res.json(listOfAuctions);
});

module.exports = router;