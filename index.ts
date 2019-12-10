import { from, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, switchMap, mergeMap } from 'rxjs/operators';

const url = 'https://pokeapi.co/api/v2/pokemon/charmander/';
const pikachuURL = 'https://pokeapi.co/api/v2/pokemon/pikachu/';
const mewtwoURL = 'https://pokeapi.co/api/v2/pokemon/mewtwo/';
const mewURL = 'https://pokeapi.co/api/v2/pokemon/mew/';

// When we use fetch to get a http response, we receive a Promise response by default
const promiseResponse = fetch(url);
const pikachuPromiseResponse = fetch(pikachuURL);
const mewTwoPromiseResponse = fetch(mewtwoURL);


// Get response from a Promise
promiseResponse.then(rawData => rawData.json()).then(data => console.log(`Promise works! I get a ${data.name}!`, data));

/** We can also convert a Promise to an Observable using the `from` operator */
from(pikachuPromiseResponse).pipe(
  switchMap(rawData => rawData.json())
).subscribe(data => {
  console.log(`Observable works! I get a ${data.name}!`, data);
})

// Note that this won't work - the `map` operator returns another Observable/Promise
// To unwrap this Promise we will need to use `switchMap` or `mergeMap` instead - we will talk 
// about how `switchMap` works later; but for now let's think about `switchMap` as an iron that you can flatten the
// Promise black box into the value that you need from the black box

from(mewTwoPromiseResponse).pipe(
  map(data => data.json())
).subscribe(data => {
  console.log(`Use map operator will return a Promise :(, I get a ${data.name}`, data);
});

// Another note: if possible we should use the `ajax` operator from RXJS, mainly because Promise is not cancellable, while you can cancel an observable
// Doc for `ajax`: https://rxjs-dev.firebaseapp.com/api/ajax/ajax
const obsFromAjax$ = ajax.getJSON(mewURL).subscribe(data => {
  console.log(`Ajax is working! I get a ${data.name}`, data);
});

// How to cancel an observable? By calling `observable.unsubscribe()`
// Imagine you have a cancel button on your UI and the button would look like this `<button (click)="() => obsFromAjax$.unsubscribe()"></button>`
obsFromAjax$.unsubscribe()

// Important notes: Observables are lazy - similar to a function, it won't be invoked until you call it. You need to call `Observable.subscribe()` to invoke the observable and get the data that you need. 

const addTwo = number => number + 2; // Won't work by itself
addTwo(2) // invoke the function and it returns the result

/** This is a cold observable */
const newObservable = of(2);
/** The cold observable become 'hot' when `subscribe` is called */
newObservable.subscribe() // call `.subscribe` and now `newObservable` is invoked :)



const onSuccess = number => console.log('add one to the observable, result is: ', number + 1);
const onError = error => console.error('handle an error, ', error);
const onComplete = () => console.log('Complete my work!');

// A callback function or an observer can be passed within the `subscribe` block
const obs$ = of(1); // By convention we append a `$` sign to the name of an observable
obs$.subscribe(onSuccess);

// If an observable returns an error, the 2nd callback is used to handle error case
const obsError$ = of(new Error('boooo... an error occurs'));
obsError$.subscribe(onSuccess, onError);

// Pass in an observer (just an object with 3 callbacks) to handle success case, error case, and the complete case
const observerObject = {
  next: onSuccess,
  error: onError,
  complete: onComplete
}

const obsWithObserver$ = of(3);
obsWithObserver$.subscribe(observerObject);