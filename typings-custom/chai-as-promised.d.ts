declare module "chai-as-promised" {
  var d: any;
  export default d;
}

declare namespace Chai {
  interface Assertion {
    eventually: any;
  }
}
