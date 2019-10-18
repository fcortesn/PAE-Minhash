import { Minhash, LshIndex } from 'minhash'; // If using Node.js

var s1 = ['minhash', 'is', 'a', 'probabilistic', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'datasets'];
var s2 = ['minhash', 'is', 'a', 'probability', 'data', 'structure', 'for',
        'estimating', 'the', 'similarity', 'between', 'documents'];
var s3 = ['cats', 'are', 'tall', 'and', 'have', 'been',
        'known', 'to', 'sing', 'quite', 'minhash', 'probabilistic', 'loudly'];

// generate a hash for each list of words argument,     prime: 4294967311, maxHash: Math.pow(2, 32) - 1
var m1 = new Minhash(); // {numPerm: 128, seed: 1}
var m2 = new Minhash();
var m3 = new Minhash();

// update each hash
s1.map(function(w) { m1.update(w) });
s2.map(function(w) { m2.update(w) });
s3.map(function(w) { m3.update(w) });

// add each document to a Locality Sensitive Hashing index
var index = new LshIndex({bandSize: 1}); // argument {bandSize: 4}
index.insert('m1', {hashvalues: m1.hashvalues});
index.insert('m2', {hashvalues: m2.hashvalues});
index.insert('m3', {hashvalues: m3.hashvalues});

// query for documents that appear similar to a query document
var matches = index.query({hashvalues: m1.hashvalues});
console.log('Jaccard similarity >= 0.5 to m1:', matches);