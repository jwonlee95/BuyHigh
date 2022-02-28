module.exports = (sequelize, DataTypes) => {

    const Auctions = sequelize.define("Auctions", {
        reserve: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "open",
        },
        current: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });

    Auctions.associate = (models) => {
        Auctions.hasOne(models.Items, {});
        Auctions.hasOne(models.Schedules, {});
    };


    return Auctions;
}