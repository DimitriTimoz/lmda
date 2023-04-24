
export class ShortProduct {
    constructor(pid, name, price, size, preview_photo) {
        this.pid = pid;
        this.name = name;
        this.price = price;
        this.size = size;
        this.preview_photo = preview_photo;
    }

}


export class Product {
    constructor(pid, name, description, price, size, state, photos, date) {
        this.pid = pid;
        this.name = name;
        this.price = price;
        this.size = size;
        this.state = state;
        this.photos = photos;
        this.date = date;
        this.description = description;
    }

    getPid() {
        return this.pid;
    }

    getName() {
        return this.name;
    }

    getPrice() {
        return this.price;
    }

    getSize() {
        return this.size;
    }

    getState() {
        return this.state;
    }

    getPhotos() {
        return this.photos;
    }
}