export default class UserDto {
    email;
    name;
    id;
    imageUrl;
    isActivated;
    tag;

    constructor(model) {
        this.email = model.email;
        this.name = model.name;
        this.id = model._id;
        this.imageUrl = model.imageUrl;
        this.isActivated = model.isActivated;
        this.tag = model.tag;
    }
}
