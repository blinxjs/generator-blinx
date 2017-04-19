# generator-blinx
A [Yeoman](http://yeoman.io) generator for BlinxJS, using `blinx-router` and `webpack`.

## Getting Started

```bash
npm install -g yo
npm install -g generator-blinx
// To generate a new Blinx Application
yo blinx
// To generate a Blinx module inside existings Blinx application
yo blinx:module
```

## How to do generated Blinx application
To transpile the code use command
```
  npm run dev
```

To keep transpilation process running in watch mode, use command
```
  npm run dev:watch
```

To start application
```
  npm start
```
By default this should be serving on localhost:8080

## License

MIT
