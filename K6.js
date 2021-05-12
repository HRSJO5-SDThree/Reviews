import http from 'k6/http';
import { check} from 'k6';
import {Counter} from 'k6/metrics'

let errorCount = new Counter('errors')

export let options = {
  thresholds:{
    errors: ["count<10"]
  },
  stages: [
    { duration: '15s', target: 300 },
    { duration: '15s', target: 500 },
    { duration: '15s', target: 700 },
    { duration: '30s', target: 1200 },
    { duration: '30s', target: 1200 },
    { duration: '30s', target: 1400 },
    { duration: '1m', target: 1400 },
    { duration: '30s', target: 1600 },
    { duration: '2m', target: 1600 },
    { duration: '1m', target: 1800 },
    { duration: '3m', target: 1800 },
    { duration: '1m', target: 2000 },
    { duration: '3m', target: 2000 },
    { duration: '1m', target: 2200 },
    { duration: '3m', target: 2200 },
    { duration: '5m', target: 0 }, // scale down. Recovery stage.
  ],
};

export default function () {
  let res= http.get('http://localhost:3000/reviews/meta?product_id=13023');
  let success = check(res, {'is status 200': (r)=>r.status === 200});
  if(!success){
    errorCount.add(1)
  }
}