module.exports = (sequelize, DataTypes) => {

    const Offers = sequelize.define("Offers", {
        offer_price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        offer_status: {
            type: DataTypes.TEXT,
            defaultStatus: "Not Set",
            allowNull: false,
        },
    });

    Offers.associate = (models) => {
        Offers.belongsTo(models.Auctions, {});
        Offers.belongsTo(models.Users, {});
    }

    return Offers;
}