/// <reference path="../definitions.d.ts"/>
module dyRt{
    export class Subject implements IObserver{
        public static create() {
            var obj = new this();

            return obj;
        }

        private _source:Stream = null;
        get source(){
            return this._source;
        }
        set source(source:Stream){
            this._source = source;
        }

        private _observer:any = new SubjectObserver();

        public subscribe(arg1?:Function|Observer, onError?:Function, onCompleted?:Function):IDisposable{
            var observer:Observer = arg1 instanceof Observer
                ? <AutoDetachObserver>arg1
                : AutoDetachObserver.create(<Function>arg1, onError, onCompleted);

            //this._source && observer.setDisposeHandler(this._source.disposeHandler);

            this._observer.addChild(observer);

            return InnerSubscription.create(this, observer);
        }

        public next(value:any){
            this._observer.next(value);
        }

        public error(error:any){
            this._observer.error(error);
        }

        public completed(){
            this._observer.completed();
        }

        public start(){
            if(!this._source){
                return;
            }

            this._source.buildStream(this);

            this._observer.setDisposeHandler();
        }

        public remove(observer:Observer){
            this._observer.removeChild(observer);
        }

        public dispose(){
            this._observer.dispose();
        }
    }
}
