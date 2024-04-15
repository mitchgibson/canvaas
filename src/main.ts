import './style.css'
import { Application, Inject } from 'pig-fwk';
import { RootComponent } from './components/Root.component.ts';
import { SocketService } from './services/Socket.service.ts';

const app = new Application(RootComponent);

app.provide([
  SocketService
])

Inject(SocketService);

app.bootstrap("#app");
