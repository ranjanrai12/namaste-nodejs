### What is nodeJS ?

NojeJs is a javascript runtime env on Google chrome's v8 engine

### What is cluster ?

Ans: Cluster is a nodejs core module which is use to scale the application by creating **multiple worker process** from a single master process.

- Each worker runs on it's own **thread/CPU** core.
- All worker share the same port
- If any worker dies then master process automatically restarts it.

![alt text](image.png)

```js
if (cluster.isPrimary) {
  const numsOfCpus = os.cpus().length;
  // const numOfCpus = os.availableParallelism;
  console.log(`Primary process is running ${process.pid}`);
  console.log(`Number of cpus ${numsOfCpus}`);
  // fork worker
  for (let i = 0; i < numsOfCpus; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log("Worker " + worker.process.pid + "is died now restarting");
    cluster.fork();
  });
} else {
  app.use("/", (req, res) => {
    res.json({ data: `Hello from express ${process.pid}` });
  });
  app.use("/demo", (req, res) => {
    res.json({ data: `Hello from demo api${process.pid}` });
  });
  app.listen(3000, () => {
    console.log("Server Started on port 3000");
  });
}
```