module.exports = (sequelize, DataTypes) => {

    const UserOpens = sequelize.define("UserOpens", {

    }, {
        timestamps: false,
    });
    
    UserOpens.associate = (models) => {
        UserOpens.belongsTo(models.Users, {
            onDelete: "cascade",
        });
        UserOpens.belongsTo(models.Auctions, {});
    }
    return UserOpens;
}