process.env.NODE_ENV = 'test';
var knex = require('../models/knexfile');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();
var db = require('../models/db');

chai.use(chaiHttp);
var expect = chai.expect;

describe('CrowdControl', function(){
    it('should be reachable at / GET', function(done){
        chai.request(server)
        .get('/')   
        .end(function(err, res){
            res.should.have.status(200);
            done();
        }
    )
    }
    );
    it('should be reachable at /api/test GET', function(done){
        chai.request(server)
        .get('/api/test')   
        .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property("express").eql("Hello From Node.js");
            res.body.should.be.a('object');
            done();
        })
    }
    );
    it('should return count of location at /count/:location GET', 
    function(done){
        var location = 'Rebeccas';
        chai.request(server)
        .get('/count/' + location)
        .end(async function(err, res){
            var count = await db.getCountAtLocation(location);
            count = count[0]['count'];
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.have.property("count").eql(count);
            done();
        })
    }
    );
    it('should return list of location at /locations-list GET', 
    function(done){
        var location = 'Rebeccas';
        chai.request(server)
        .get('/locations-list')
        .end(async function(err, res){
            var locations = await db.getLocations();
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property("list").eql(locations);
            done();
        })
    }
    );
    it('should update count of location at /data-add POST', 
    function(done){
        var location = 'Rebeccas';
        var countAmt = 2
        chai.request(server)
        .get('/count/' + location)
        .end(function(err, res){
            var prevAmt = res.body[0]['count'];
            done();
        })
        chai.request(server)
        .post('/data-add')
        .send({'location_name': location, 'count': countAmt, 
               'date': '2018-01-11 17:57:16.736741'})
        .end(async function(err, res){
            var count = await db.getCountAtLocation(location);
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property("count").eql(prevAmt + countAmt);
            done();
        })
    }
    );


})


