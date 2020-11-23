//these are like the seperate accounts
const secret_data = require('data-store')({ path: process.cwd() + '/data/secrets.json' });
const store_data = require('data-store')({ path: process.cwd() + '/data/scores.json' });
class Secret {

    constructor (id, name, pass) {
        this.id = id;
        this.name = name;
        this.salt = "saltplaceing"
        this.pass = pass;
    }

    update (pass) {
        this.pass = pass;
        //console.log(this)
        secret_data.set(this.id.toString(), this);
    }

    delete () {
        secret_data.del(this.id.toString());
    }
}

Secret.getAllIDs = () => {
    return Object.keys(secret_data.data).map(id => parseInt(id));
};

Secret.findByID = (id) => {
    let sdata = secret_data.get(id);
    //console.log(sdata)
    if (sdata != null) {
        return new Secret(sdata.id, sdata.name, sdata.pass);
    }
    return null;
};

Secret.next_id = Secret.getAllIDs().reduce((max, next_id) => {
    if (max < next_id) {
        return next_id;
    }
    return max;
}, -1) + 1;

Secret.create = (name, pass) => {
    let id = Secret.next_id;
    Secret.next_id += 1;
    let s = new Secret(id, name, pass);
    secret_data.set(s.id.toString(), s);
    return s;
}

//Secret.create("feli", "foo")


class Score {

    constructor (id, name, mode, high_score ) {
        this.id = id;
        this.name = name;
        this.mode = mode;
        this.high_score = high_score

    }

    update2 (score) {

        this.high_score = score;
        store_data.set(this.id.toString(), this);
    }

    delete2 () {
        store_data.del(this.id.toString());
    }
}

Score.getAllIDs2 = () => {
    //console.log("score")
    return Object.keys(store_data.data).map(id => parseInt(id));
};


Score.findByID2 = (id) => {
    let sdata = store_data.get(id);
    //console.log(sdata)
    if (sdata != null) {
        return new Score(sdata.id, sdata.name, sdata.mode, sdata.high_score);
    }
    return null;
};

Score.next_id2 = Score.getAllIDs2().reduce((max, next_id2) => {
    if (max < next_id2) {
        return next_id2;
    }
    return max;
}, -1) + 1;

Score.create2 = (name, mode, high_score) => {
    let id = Score.next_id2;
    Score.next_id2 += 1;
    let s = new Score(id, name, mode, high_score);
    store_data.set(s.id.toString(), s);
    return s;
}
//module.exports = Secret, Score;
//module.exports = Score;
module.exports = {
    Secret: Secret,
    Score: Score
}