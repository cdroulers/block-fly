export function startFireworks(timeoutMs: number): void {
  const fireworks = document.getElementById("fireworks")!;

  fireworks.classList.add("pyro");
  setTimeout(() => {
    fireworks.classList.remove("pyro");
  }, timeoutMs);
}
