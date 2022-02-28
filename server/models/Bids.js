
module.exports = (sequelize, DataTypes) => {

    const Bids = sequelize.define("Bids", {
        time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },{
        timestamps: false,
    });

    Bids.associate = (models) => {
        Bids.belongsTo(models.Auctions, {});
        Bids.belongsTo(models.Users, {});
    }

    return Bids;
}