/**
 * code-samples.ts — The three files shown in the hero code window.
 * They illustrate how we work across the stack; they are not excerpts from a client codebase.
 */
import type { Lang } from './highlight';

export type CodeSample = { id: string; file: string; lang: Lang; language: string; code: string };

export const codeSamples: CodeSample[] = [
  {
    id: 'architecture',
    file: 'Architecture.ts',
    lang: 'ts',
    language: 'TypeScript',
    code: `// One team. Every layer of the stack.
export const platform = defineArchitecture({
  clients: {
    web: react({ ssr: true }),
    mobile: flutter({ targets: ["ios", "android"] }),
  },
  services: {
    api: springBoot({ java: 21, style: "event-driven" }),
    realtime: node({ transport: "websocket" }),
  },
  data: {
    primary: postgres({ replicas: 2 }),
    cache: redis(),
    events: kafka({ topics: ["orders", "inventory"] }),
  },
  delivery: docker().pipeline("ci/cd").to("cloud"),
});`,
  },
  {
    id: 'service',
    file: 'SpringBootService.java',
    lang: 'java',
    language: 'Java',
    code: `@Service
@RequiredArgsConstructor
public class OrderService {
  private final OrderRepository orders;
  private final KafkaTemplate<String, OrderEvent> events;

  @Transactional
  public Order place(CreateOrder command) {
    Order order = orders.save(Order.from(command));
    events.send("orders.placed", OrderEvent.of(order));
    return order;
  }

  @KafkaListener(topics = "inventory.reserved")
  void onReserved(InventoryEvent event) {
    orders.confirm(event.orderId());
  }
}`,
  },
  {
    id: 'deploy',
    file: 'Deploy.yml',
    lang: 'yaml',
    language: 'YAML',
    code: `name: deploy
on:
  push:
    branches: [main]

jobs:
  ship:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Test
        run: ./mvnw -B verify
      - name: Build image
        run: docker build -t app:\${{ github.sha }} .
      - name: Roll out
        run: kubectl set image deploy/api api=app:\${{ github.sha }}
      - name: Smoke test
        run: curl -fsS https://$HOST/actuator/health`,
  },
];
