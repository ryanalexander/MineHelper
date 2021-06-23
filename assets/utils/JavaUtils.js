exports.formatTime = (time) => {
    let x = time/1000;
    let seconds = x % 60;
    x/=60;
    let minutes = x % 60;
    x/=60;
    let hours = x % 24;
    x/=24;
    let days = x;

    return (days>=1?days+" Days ":"")+(hours>=1?hours+" Hours ":"")+(minutes>=1?minutes+" Minutes ":"")+(seconds>=1?seconds+" Seconds ":"");
}