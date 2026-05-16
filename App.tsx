import React from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Brand, Card, FakeQr, Header, MascotCup, Pill, PosterImage, Screen, StatusTag } from './src/components/ui';
import { event, operators } from './src/data/mockEvents';
import { dictionaries } from './src/i18n';
import { money, Order, OrderStatus, PartyPayProvider, usePartyPay } from './src/store/usePartyPay';
import { colors } from './src/theme/colors';
import { type } from './src/theme/typography';

type Route =
  | 'splash' | 'onboarding' | 'launcher' | 'login' | 'eventEntry' | 'eventConfirm' | 'menu' | 'product' | 'cart' | 'pix' | 'approved' | 'pickup' | 'history' | 'profile'
  | 'barQueue' | 'barOrder' | 'scanner' | 'scanResult'
  | 'adminDash' | 'adminProducts' | 'adminOrders' | 'adminOperators' | 'adminFinance';

function Shell() {
  const [stack, setStack] = React.useState<Route[]>(['splash']);
  const route = stack[stack.length - 1];
  const push = (next: Route) => setStack((s) => [...s, next]);
  const reset = (next: Route) => setStack([next]);
  const back = () => setStack((s) => s.length > 1 ? s.slice(0, -1) : s);

  React.useEffect(() => {
    const timer = setTimeout(() => reset('onboarding'), 1200);
    return () => clearTimeout(timer);
  }, []);

  const props = { push, reset, back };
  return (
    <>
      <StatusBar style="light" />
      <Animated.View key={route} entering={route === 'splash' ? FadeIn.duration(300) : SlideInRight.springify().damping(18)} style={{ flex: 1 }}>
        {route === 'splash' && <Splash />}
        {route === 'onboarding' && <Onboarding {...props} />}
        {route === 'launcher' && <Launcher {...props} />}
        {route === 'login' && <Login {...props} />}
        {route === 'eventEntry' && <EventEntry {...props} />}
        {route === 'eventConfirm' && <EventConfirm {...props} />}
        {route === 'menu' && <Menu {...props} />}
        {route === 'product' && <ProductDetail {...props} />}
        {route === 'cart' && <Cart {...props} />}
        {route === 'pix' && <PixPayment {...props} />}
        {route === 'approved' && <Approved {...props} />}
        {route === 'pickup' && <PickupQr {...props} />}
        {route === 'history' && <History {...props} />}
        {route === 'profile' && <Profile {...props} />}
        {route === 'barQueue' && <BartenderQueue {...props} />}
        {route === 'barOrder' && <BartenderOrder {...props} />}
        {route === 'scanner' && <Scanner {...props} />}
        {route === 'scanResult' && <ScanResult {...props} />}
        {route === 'adminDash' && <AdminDash {...props} />}
        {route === 'adminProducts' && <AdminProducts {...props} />}
        {route === 'adminOrders' && <AdminOrders {...props} />}
        {route === 'adminOperators' && <AdminOperators {...props} />}
        {route === 'adminFinance' && <AdminFinance {...props} />}
      </Animated.View>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PartyPayProvider>
        <Shell />
      </PartyPayProvider>
    </SafeAreaProvider>
  );
}

function Splash() {
  return (
    <Screen glow="lavender">
      <View style={styles.centerScreen}>
        <Animated.View entering={FadeInUp.duration(700)} style={styles.ring}>
          <Text style={styles.ringText}>PARTY PAY • PIX • SEM FILA •</Text>
        </Animated.View>
        <MascotCup size={154} color={colors.lavender} />
        <Animated.Text entering={FadeInDown.delay(280)} style={styles.splashLogo}>party{'\n'}<Text style={{ color: colors.acid }}>pay</Text><Text style={{ color: colors.coral }}>.</Text></Animated.Text>
        <Text style={styles.dim}>bebida sem fila · pediu, pagou, retirou</Text>
      </View>
    </Screen>
  );
}

function Onboarding({ push }: NavProps) {
  return (
    <Screen glow="coral">
      <ScrollView contentContainerStyle={styles.onboarding}>
        <View style={styles.heroMascot}>
          <Text style={styles.sticker}>racha fácil</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <MascotCup size={84} color={colors.acid} />
            <MascotCup size={116} color={colors.coral} />
            <MascotCup size={84} color={colors.text} />
          </View>
        </View>
        <Text style={styles.hero}>racha <Text style={styles.serif}>com a</Text>{'\n'}galera</Text>
        <Text style={styles.copy}>Divide a conta igual, por item ou valor. Cada um paga o seu pelo Pix e o bar só recebe pedido pago.</Text>
        <Button label="continuar" onPress={() => push('launcher')} icon="arrow-forward" />
      </ScrollView>
    </Screen>
  );
}

function Launcher({ push }: NavProps) {
  const { setRole, locale } = usePartyPay();
  const t = dictionaries[locale];
  const choose = (role: 'customer' | 'bartender' | 'admin', route: Route) => {
    setRole(role);
    push(role === 'customer' ? 'login' : route);
  };
  return (
    <Screen glow="acid">
      <View style={styles.launcher}>
        <Brand />
        <Text style={styles.hero}>partiu{'\n'}<Text style={styles.serif}>rolê?</Text></Text>
        <Text style={styles.copy}>Demo Android-first com cliente, bartender e admin. Tudo local, navegável e simulado.</Text>
        <View style={{ gap: 12, marginTop: 28 }}>
          <Button label={t.customer} onPress={() => choose('customer', 'login')} icon="person" />
          <Button label={t.bartender} onPress={() => choose('bartender', 'barQueue')} variant="lavender" icon="beer" />
          <Button label={t.admin} onPress={() => choose('admin', 'adminDash')} variant="coral" icon="stats-chart" />
        </View>
      </View>
    </Screen>
  );
}

function Login({ push, back }: NavProps) {
  return (
    <Screen glow="lavender">
      <Header onBack={back} sub="conta demo" title="login" />
      <View style={styles.page}>
        <Brand />
        <Text style={styles.h1}>entra rápido{'\n'}<Text style={styles.serif}>e cai no bar</Text></Text>
        <Field label="nome" value="Lucas Rocha" />
        <Field label="celular" value="(11) 99999-7421" />
        <Button label="Entrar na conta demo" onPress={() => push('eventEntry')} icon="log-in" />
      </View>
    </Screen>
  );
}

function EventEntry({ push, back }: NavProps) {
  return (
    <Screen glow="acid">
      <Header onBack={back} sub="acesso ao evento" title="entrar no rolê" />
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.h1}>escolhe o{'\n'}<Text style={styles.serif}>rolê</Text><Text style={{ color: colors.coral }}>.</Text></Text>
        <View style={styles.searchBox}><Ionicons name="search" size={18} color={colors.mute} /><TextInput placeholder="busca por bar, festa, código..." placeholderTextColor={colors.mute} style={styles.input} defaultValue="PV7421" /></View>
        <View style={styles.row}>
          <Pill label="escanear" active />
          <Pill label="código" />
          <Pill label="perto de mim" />
        </View>
        <EventCard onPress={() => push('eventConfirm')} />
        <Button label="simular QR encontrado" onPress={() => push('eventConfirm')} icon="qr-code" />
      </ScrollView>
    </Screen>
  );
}

function EventConfirm({ push, back }: NavProps) {
  return (
    <Screen glow="lavender">
      <Header onBack={back} sub="evento encontrado" title={event.code} />
      <ScrollView contentContainerStyle={styles.page}>
        <ImageBackground source={event.poster} imageStyle={{ borderRadius: 28 }} style={styles.eventHero}>
          <LinearGradient colors={['transparent', 'rgba(11,11,13,0.9)']} style={StyleSheet.absoluteFill} />
          <Text style={styles.eventTitle}>Pagode da{'\n'}<Text style={styles.serif}>Vila</Text></Text>
        </ImageBackground>
        <Card>
          <StatusTag label="aberto · sem fila" tone="success" />
          <Text style={styles.cardTitle}>{event.place}</Text>
          <Text style={styles.dim}>Retirada no {event.counter} · preparo médio {event.prepTime}</Text>
        </Card>
        <Button label="abrir cardápio" onPress={() => push('menu')} icon="restaurant" />
      </ScrollView>
    </Screen>
  );
}

function Menu({ push }: NavProps) {
  const { products, selectProduct, cart } = usePartyPay();
  const total = cart.length;
  return (
    <Screen glow="acid">
      <ScrollView contentContainerStyle={[styles.page, { paddingTop: 56, paddingBottom: 120 }]}>
        <View style={styles.topRow}><Brand /><Pressable style={styles.avatar} onPress={() => push('profile')}><Text style={styles.avatarText}>L</Text></Pressable></View>
        <Text style={styles.h1}>cardápio{'\n'}<Text style={styles.serif}>do rolê</Text></Text>
        <View style={styles.row}><Pill label="tudo" active /><Pill label="cervejas" /><Pill label="drinks" /><Pill label="combos" /></View>
        <Card style={{ backgroundColor: colors.coral, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <MascotCup size={70} color={colors.acid} />
          <View style={{ flex: 1 }}><Text style={[styles.cardTitle, { color: colors.bg }]}>balde com desconto</Text><Text style={[styles.mono, { color: colors.bg }]}>combo · -25%</Text></View>
        </Card>
        <View style={styles.grid}>
          {products.map((product, index) => (
            <Pressable key={product.id} onPress={() => { selectProduct(product.id); push('product'); }} style={{ width: '48%' }}>
              <Card delay={index * 60} style={styles.productTile}>
                <PosterImage source={product.image} tint={product.tint} label={product.tag ?? product.category} height={112} />
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.price}>{money(product.price)}</Text>
                {!product.available ? <StatusTag label="indisponível" tone="error" /> : null}
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <BottomBar label={`${total || 0} itens no carrinho`} cta="ver carrinho" onPress={() => push('cart')} disabled={!total} />
    </Screen>
  );
}

function ProductDetail({ push, back }: NavProps) {
  const { products, selectedProductId, addToCart } = usePartyPay();
  const product = products.find((p) => p.id === selectedProductId) ?? products[0];
  const [qty, setQty] = React.useState(1);
  return (
    <Screen glow="lavender">
      <Header onBack={back} sub={product.category} title="produto" />
      <ScrollView contentContainerStyle={styles.page}>
        <PosterImage source={product.image} tint={product.tint} label={product.tag ?? 'da casa'} height={280} />
        <Text style={styles.h1}>{product.name.split(' ')[0]}{'\n'}<Text style={styles.serif}>{product.name.split(' ').slice(1).join(' ')}</Text></Text>
        <Text style={styles.copy}>{product.description}</Text>
        <View style={styles.detailRow}><Text style={styles.priceLarge}>{money(product.price)}</Text><Qty qty={qty} setQty={setQty} /></View>
        <Button label={`adicionar · ${money(product.price * qty)}`} onPress={() => { addToCart(product.id, qty); push('cart'); }} icon="add" />
      </ScrollView>
    </Screen>
  );
}

function Cart({ push, back }: NavProps) {
  const { cart, products, changeQty } = usePartyPay();
  const subtotal = cart.reduce((sum, item) => sum + (products.find((p) => p.id === item.productId)?.price ?? 0) * item.qty, 0);
  const fee = 1.9;
  return (
    <Screen glow="coral">
      <Header onBack={back} sub={event.name} title="seu pedido" />
      <ScrollView contentContainerStyle={[styles.page, { paddingBottom: 170 }]}>
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return <CartRow key={item.productId} product={product} qty={item.qty} onMinus={() => changeQty(product.id, -1)} onPlus={() => changeQty(product.id, 1)} />;
        })}
        {!cart.length ? <Empty title="Carrinho vazio" text="Volta pro cardápio e escolhe uma bebida bonita." /> : null}
        <Card>
          <Total label="subtotal" value={money(subtotal)} />
          <Total label="taxa de serviço" value="R$ 0,00" />
          <Total label="taxa Party Pay" value={money(fee)} />
          <View style={styles.separator} />
          <Total label="total" value={money(subtotal + fee)} big />
        </Card>
      </ScrollView>
      <View style={styles.sticky}>
        <Button label="racha com a galera" onPress={() => push('pix')} variant="ghost" icon="people" style={{ flex: 1 }} />
        <Button label="pagar Pix" onPress={() => push('pix')} icon="qr-code" style={{ flex: 1.15 }} />
      </View>
    </Screen>
  );
}

function PixPayment({ push, back }: NavProps) {
  const { createPaidOrder } = usePartyPay();
  return (
    <Screen glow="lavender">
      <Header onBack={back} sub="pix · simulado" title="pagamento" />
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={[styles.h1, { textAlign: 'center' }]}>paga pelo{'\n'}<Text style={styles.serif}>Pix</Text></Text>
        <Card style={{ backgroundColor: colors.lavender, alignItems: 'center' }}>
          <FakeQr size={230} />
          <Text style={[styles.mono, { color: colors.bg, marginTop: 18 }]}>0002012658BR.GOV.BCB.PIX.PARTYPAY.PV7421</Text>
        </Card>
        <Card><Text style={styles.cardTitle}>aguardando pagamento</Text><Text style={styles.dim}>Esta tela simula criação de cobrança Pix, countdown e confirmação instantânea.</Text></Card>
        <Button label="simular Pix aprovado" onPress={() => { createPaidOrder(); push('approved'); }} icon="checkmark-circle" />
      </ScrollView>
    </Screen>
  );
}

function Approved({ push }: NavProps) {
  return (
    <Screen glow="success">
      <View style={[styles.centerScreen, { backgroundColor: colors.success }]}>
        <Text style={[styles.successHero, { color: colors.bg }]}>pagamento{'\n'}<Text style={styles.serif}>aprovado.</Text></Text>
        <MascotCup size={126} color={colors.acid} />
        <Card style={{ backgroundColor: colors.bg, width: '100%' }}>
          <Text style={styles.cardTitle}>Pedido liberado para o bar</Text>
          <Text style={styles.dim}>Geramos um token de retirada único. Mostre o QR quando o pedido ficar pronto.</Text>
        </Card>
        <Button label="ver QR de retirada" onPress={() => push('pickup')} variant="dark" icon="qr-code" style={{ width: '100%' }} />
      </View>
    </Screen>
  );
}

function PickupQr({ push, back }: NavProps) {
  const { orders, setOrderStatus } = usePartyPay();
  const order = orders[0];
  return (
    <Screen glow="success">
      <Header onBack={back} sub="retirada" title={order.id} />
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={[styles.h1, { textAlign: 'center' }]}>mostra esse{'\n'}<Text style={styles.serif}>QR pro barman</Text></Text>
        <Ticket order={order} />
        <StatusTimeline status={order.status} />
        <View style={styles.row}>
          <Button label="histórico" onPress={() => push('history')} variant="ghost" style={{ flex: 1 }} />
          <Button label="pedido pronto" onPress={() => { setOrderStatus(order.id, 'ready'); push('history'); }} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function History({ back }: NavProps) {
  const { orders } = usePartyPay();
  return (
    <Screen glow="acid">
      <Header onBack={back} sub="cliente" title="histórico" />
      <ScrollView contentContainerStyle={styles.page}>
        {orders.map((order) => <OrderSummary key={order.id} order={order} showMoney />)}
      </ScrollView>
    </Screen>
  );
}

function Profile({ back, reset }: NavProps) {
  const { locale, toggleLocale, setRole } = usePartyPay();
  return (
    <Screen glow="lavender">
      <Header onBack={back} sub="perfil" title="Lucas Rocha" />
      <View style={styles.page}>
        <Card><Text style={styles.cardTitle}>idioma</Text><Text style={styles.dim}>Atual: {locale}</Text></Card>
        <Button label="alternar pt-BR / en-US" onPress={toggleLocale} icon="language" />
        <Button label="sair da demo" onPress={() => { setRole('guest'); reset('launcher'); }} variant="ghost" icon="log-out" />
      </View>
    </Screen>
  );
}

function BartenderQueue({ push }: NavProps) {
  const { orders } = usePartyPay();
  return (
    <Screen glow="lavender">
      <ScrollView contentContainerStyle={[styles.page, { paddingTop: 56 }]}>
        <Brand business />
        <Text style={styles.h1}>pedidos{'\n'}<Text style={styles.serif}>ao vivo</Text></Text>
        <View style={styles.row}><Pill label={`todos · ${orders.length}`} active /><Pill label="preparo" /><Pill label="prontos" /></View>
        {orders.map((order) => <Pressable key={order.id} onPress={() => push('barOrder')}><OrderSummary order={order} /></Pressable>)}
        <Button label="abrir scanner" onPress={() => push('scanner')} icon="scan" />
      </ScrollView>
      <RoleNav active="pedidos" push={push} />
    </Screen>
  );
}

function BartenderOrder({ push, back }: NavProps) {
  const { orders, products, setOrderStatus } = usePartyPay();
  const order = orders[0];
  return (
    <Screen glow="acid">
      <Header onBack={back} sub="sem financeiro" title={`pedido ${order.id}`} />
      <ScrollView contentContainerStyle={styles.page}>
        <Card>
          <StatusTag label={labelForStatus(order.status)} tone={toneForStatus(order.status)} />
          <Text style={styles.cardTitle}>{order.customer}</Text>
          {order.items.map((item) => <Text key={item.productId} style={styles.dim}>{item.qty}x {products.find((p) => p.id === item.productId)?.name}</Text>)}
        </Card>
        <Button label="marcar em preparo" onPress={() => setOrderStatus(order.id, 'preparing')} variant="lavender" />
        <Button label="marcar pronto" onPress={() => setOrderStatus(order.id, 'ready')} />
        <Button label="scanear QR de retirada" onPress={() => push('scanner')} icon="scan" />
      </ScrollView>
    </Screen>
  );
}

function Scanner({ push, back }: NavProps) {
  const { scanToken, orders } = usePartyPay();
  return (
    <Screen glow="coral">
      <Header onBack={back} sub="scanner simulado" title="validar QR" />
      <View style={styles.scannerWrap}>
        <View style={styles.scannerFrame}><View style={styles.scanLine} /><FakeQr size={180} /></View>
        <Text style={styles.copy}>A câmera é simulada. Use os botões para validar token novo, usado ou inválido.</Text>
        <Button label="scan válido" onPress={() => { scanToken(orders[0]?.token); push('scanResult'); }} icon="checkmark" />
        <Button label="scan mesmo QR de novo" onPress={() => { scanToken(orders[0]?.token); push('scanResult'); }} variant="ghost" />
        <Button label="scan inválido" onPress={() => { scanToken('TOKEN-FAKE'); push('scanResult'); }} variant="coral" />
      </View>
    </Screen>
  );
}

function ScanResult({ back }: NavProps) {
  const { lastScan } = usePartyPay();
  const ok = lastScan === 'valid';
  const used = lastScan === 'used';
  return (
    <Screen glow={ok ? 'success' : 'coral'}>
      <Header onBack={back} sub="resultado" title="scanner" />
      <View style={styles.centerScreen}>
        <Ionicons name={ok ? 'checkmark-circle' : 'close-circle'} size={94} color={ok ? colors.success : colors.error} />
        <Text style={styles.h1}>{ok ? 'QR válido' : used ? 'QR já usado' : 'QR inválido'}</Text>
        <Text style={styles.copy}>{ok ? 'Pedido marcado como entregue. O token não pode ser usado novamente.' : 'A retirada foi bloqueada pela camada local de simulação.'}</Text>
        <Button label="voltar para fila" onPress={back} />
      </View>
    </Screen>
  );
}

function AdminDash({ push }: NavProps) {
  const { orders } = usePartyPay();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const fee = orders.reduce((s, o) => s + o.fee, 0);
  return (
    <Screen glow="acid">
      <ScrollView contentContainerStyle={[styles.page, { paddingTop: 56, paddingBottom: 120 }]}>
        <Brand business />
        <Text style={styles.h1}>pagode da{'\n'}<Text style={styles.serif}>vila</Text></Text>
        <Card style={{ backgroundColor: colors.acid }}>
          <Text style={[styles.mono, { color: colors.bg }]}>FATURAMENTO HOJE</Text>
          <Text style={[styles.moneyHero, { color: colors.bg }]}>{money(revenue)}</Text>
          <Text style={{ color: colors.bg, fontWeight: '800' }}>Comissão Party Pay 5% · {money(fee)}</Text>
        </Card>
        <View style={styles.grid}>
          <Kpi label="pedidos" value={String(orders.length)} />
          <Kpi label="ticket médio" value={money(revenue / Math.max(orders.length, 1))} />
          <Kpi label="em preparo" value={String(orders.filter((o) => o.status === 'preparing').length)} />
          <Kpi label="prontos" value={String(orders.filter((o) => o.status === 'ready').length)} />
        </View>
        <Button label="cardápio" onPress={() => push('adminProducts')} icon="restaurant" />
        <Button label="pedidos" onPress={() => push('adminOrders')} variant="ghost" icon="receipt" />
        <Button label="operadores" onPress={() => push('adminOperators')} variant="ghost" icon="people" />
        <Button label="financeiro simulado" onPress={() => push('adminFinance')} variant="lavender" icon="wallet" />
      </ScrollView>
    </Screen>
  );
}

function AdminProducts({ back }: NavProps) {
  const { products, toggleProduct, addMockProduct } = usePartyPay();
  return (
    <Screen glow="lavender">
      <Header onBack={back} sub="admin master" title="cardápio" />
      <ScrollView contentContainerStyle={styles.page}>
        {products.map((product) => (
          <Card key={product.id} style={styles.adminRow}>
            <PosterImage source={product.image} tint={product.tint} height={64} />
            <View style={{ flex: 1 }}><Text style={styles.cardTitle}>{product.name}</Text><Text style={styles.dim}>{money(product.price)}</Text></View>
            <Pressable onPress={() => toggleProduct(product.id)}><StatusTag label={product.available ? 'ativo' : 'off'} tone={product.available ? 'success' : 'error'} /></Pressable>
          </Card>
        ))}
        <Button label="adicionar produto mock" onPress={addMockProduct} icon="add-circle" />
      </ScrollView>
    </Screen>
  );
}

function AdminOrders({ back }: NavProps) {
  const { orders } = usePartyPay();
  return (
    <Screen glow="coral">
      <Header onBack={back} sub="admin master" title="pedidos" />
      <ScrollView contentContainerStyle={styles.page}>{orders.map((order) => <OrderSummary key={order.id} order={order} showMoney />)}</ScrollView>
    </Screen>
  );
}

function AdminOperators({ back }: NavProps) {
  const [codes, setCodes] = React.useState(['BAR-204', 'SCAN-112', 'ADM-901']);
  return (
    <Screen glow="acid">
      <Header onBack={back} sub="acessos" title="operadores" />
      <ScrollView contentContainerStyle={styles.page}>
        {operators.map((op) => <Card key={op.id} style={styles.adminRow}><View style={styles.avatar}><Text style={styles.avatarText}>{op.name[0]}</Text></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{op.name}</Text><Text style={styles.dim}>{op.role} · {op.code}</Text></View><StatusTag label={op.status} tone={op.status === 'online' ? 'success' : 'ghost'} /></Card>)}
        {codes.slice(3).map((code) => <Card key={code}><Text style={styles.cardTitle}>Novo acesso bartender</Text><Text style={styles.dim}>{code} · válido por 15 min</Text></Card>)}
        <Button label="criar código de bartender" onPress={() => setCodes((current) => [...current, `BAR-${Math.floor(100 + Math.random() * 899)}`])} icon="key" />
      </ScrollView>
    </Screen>
  );
}

function AdminFinance({ back }: NavProps) {
  const { orders } = usePartyPay();
  const total = orders.reduce((s, o) => s + o.total, 0);
  const fee = orders.reduce((s, o) => s + o.fee, 0);
  return (
    <Screen glow="lavender">
      <Header onBack={back} sub="simulação" title="financeiro" />
      <View style={styles.page}>
        <Card><Text style={styles.cardTitle}>split do evento</Text><Total label="bruto" value={money(total)} /><Total label="Party Pay 5%" value={money(fee)} /><Total label="repasse simulado" value={money(total - fee)} big /></Card>
        <Card><Text style={styles.dim}>Dados visíveis apenas ao admin. Bartender não acessa receita, comissão ou repasse.</Text></Card>
      </View>
    </Screen>
  );
}

type NavProps = { push: (route: Route) => void; reset: (route: Route) => void; back: () => void };

function Field({ label, value }: { label: string; value: string }) {
  return <View style={styles.field}><Text style={styles.mono}>{label}</Text><Text style={styles.fieldValue}>{value}</Text></View>;
}

function EventCard({ onPress }: { onPress: () => void }) {
  return <Pressable onPress={onPress}><Card><PosterImage source={event.image} tint={colors.lavender} label="ao vivo" /><Text style={styles.cardTitle}>Pagode da Vila</Text><Text style={styles.dim}>{event.place} · preparo ~ {event.prepTime}</Text></Card></Pressable>;
}

function Qty({ qty, setQty }: { qty: number; setQty: (n: number) => void }) {
  return <View style={styles.qty}><Pressable onPress={() => setQty(Math.max(1, qty - 1))}><Text style={styles.qtyBtn}>-</Text></Pressable><Text style={styles.qtyText}>{qty}</Text><Pressable onPress={() => setQty(qty + 1)}><Text style={[styles.qtyBtn, { backgroundColor: colors.acid, color: colors.bg }]}>+</Text></Pressable></View>;
}

function CartRow({ product, qty, onMinus, onPlus }: { product: any; qty: number; onMinus: () => void; onPlus: () => void }) {
  return <Card style={styles.adminRow}><PosterImage source={product.image} tint={product.tint} height={62} /><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{product.name}</Text><Text style={styles.dim}>{money(product.price * qty)}</Text></View><Qty qty={qty} setQty={(n) => n > qty ? onPlus() : onMinus()} /></Card>;
}

function Total({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return <View style={styles.total}><Text style={[styles.dim, big && styles.cardTitle]}>{label}</Text><Text style={[styles.monoValue, big && styles.price]}>{value}</Text></View>;
}

function BottomBar({ label, cta, onPress, disabled }: { label: string; cta: string; onPress: () => void; disabled?: boolean }) {
  return <View style={styles.bottomBar}><Text style={styles.bottomLabel}>{label}</Text><Pressable disabled={disabled} onPress={onPress} style={[styles.bottomCta, disabled && { opacity: 0.45 }]}><Text style={styles.bottomCtaText}>{cta}</Text><Ionicons name="arrow-forward" color={colors.acid} size={16} /></Pressable></View>;
}

function Ticket({ order }: { order: Order }) {
  return <Card style={{ backgroundColor: colors.text, alignItems: 'center' }}><Text style={[styles.brandTextDark]}>party pay</Text><FakeQr size={226} /><Text style={[styles.mono, { color: colors.bg, marginTop: 14 }]}>{order.token}</Text><Text style={[styles.cardTitle, { color: colors.bg }]}>{order.id} · {event.counter}</Text></Card>;
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  const steps: OrderStatus[] = ['paid', 'preparing', 'ready', 'delivered'];
  const current = steps.indexOf(status);
  return <Card><View style={styles.stepRow}>{steps.map((step, index) => <View key={step} style={[styles.step, index <= current && { backgroundColor: index === current ? colors.acid : colors.success }]}><Text style={[styles.stepText, index <= current && { color: colors.bg }]}>{labelForStatus(step)}</Text></View>)}</View></Card>;
}

function OrderSummary({ order, showMoney }: { order: Order; showMoney?: boolean }) {
  return <Card style={styles.orderCard}><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{order.id} · {order.customer}</Text><Text style={styles.dim}>{order.items.reduce((s, i) => s + i.qty, 0)} itens · {order.createdAt}</Text>{showMoney ? <Text style={styles.price}>{money(order.total)}</Text> : null}</View><StatusTag label={labelForStatus(order.status)} tone={toneForStatus(order.status)} /></Card>;
}

function Empty({ title, text }: { title: string; text: string }) {
  return <Card style={{ alignItems: 'center' }}><MascotCup size={80} color={colors.lavender} /><Text style={styles.cardTitle}>{title}</Text><Text style={[styles.dim, { textAlign: 'center' }]}>{text}</Text></Card>;
}

function Kpi({ label, value }: { label: string; value: string }) {
  return <Card style={{ flex: 1, minHeight: 112 }}><Text style={styles.mono}>{label}</Text><Text style={styles.kpiValue}>{value}</Text></Card>;
}

function RoleNav({ active, push }: { active: string; push: (route: Route) => void }) {
  return <View style={styles.roleNav}><Pill label={active} active /><Pressable onPress={() => push('scanner')}><Pill label="scanner" /></Pressable></View>;
}

function labelForStatus(status: OrderStatus) {
  return ({ paid: 'pago', preparing: 'em preparo', ready: 'pronto', delivered: 'entregue' })[status];
}

function toneForStatus(status: OrderStatus): 'acid' | 'success' | 'coral' | 'lavender' | 'ghost' {
  return status === 'ready' || status === 'delivered' ? 'success' : status === 'preparing' ? 'acid' : 'lavender';
}

const styles = StyleSheet.create({
  centerScreen: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 18 },
  splashLogo: { ...type.hero, color: colors.text, textAlign: 'center', fontSize: 74, lineHeight: 68 },
  ring: { borderWidth: 1, borderColor: colors.acid, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  ringText: { color: colors.acid, fontFamily: 'monospace', fontSize: 10, letterSpacing: 1.4 },
  dim: { color: colors.dim, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  copy: { color: colors.dim, fontSize: 15, lineHeight: 22, fontWeight: '600' },
  onboarding: { padding: 24, paddingTop: 74, gap: 22 },
  heroMascot: { height: 360, borderRadius: 32, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sticker: { position: 'absolute', right: 18, top: 18, color: colors.acid, backgroundColor: colors.bg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, fontFamily: 'monospace', fontWeight: '900', transform: [{ rotate: '8deg' }] },
  hero: { ...type.hero, color: colors.text },
  h1: { ...type.h1, color: colors.text },
  serif: { color: colors.acid, fontStyle: 'italic', fontWeight: '500' },
  launcher: { flex: 1, padding: 24, paddingTop: 72 },
  page: { padding: 20, gap: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.lavender, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.bg, fontSize: 17, fontWeight: '900' },
  field: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.line },
  fieldValue: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 5 },
  mono: { color: colors.mute, fontSize: 11, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 0.8 },
  searchBox: { minHeight: 54, borderRadius: 999, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface },
  input: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  eventHero: { height: 340, borderRadius: 28, overflow: 'hidden', justifyContent: 'flex-end', padding: 22 },
  eventTitle: { color: colors.text, fontSize: 48, lineHeight: 46, fontWeight: '900' },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productTile: { width: '100%', padding: 10 },
  productName: { color: colors.text, fontSize: 14, fontWeight: '900', marginTop: 10, minHeight: 34 },
  price: { color: colors.acid, fontSize: 18, fontWeight: '900', marginTop: 4 },
  priceLarge: { color: colors.acid, fontSize: 36, fontWeight: '900' },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qty: { height: 52, borderRadius: 999, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4, gap: 8 },
  qtyBtn: { width: 42, height: 42, borderRadius: 21, color: colors.text, textAlign: 'center', textAlignVertical: 'center', fontSize: 24, fontWeight: '900' },
  qtyText: { color: colors.text, minWidth: 22, textAlign: 'center', fontSize: 19, fontWeight: '900' },
  adminRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  separator: { height: 1, backgroundColor: colors.line, marginVertical: 10 },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 },
  monoValue: { color: colors.text, fontFamily: 'monospace', fontWeight: '800' },
  sticky: { position: 'absolute', left: 16, right: 16, bottom: 22, flexDirection: 'row', gap: 10 },
  bottomBar: { position: 'absolute', left: 20, right: 20, bottom: 22, borderRadius: 999, backgroundColor: colors.acid, padding: 10, paddingLeft: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: colors.acid, shadowOpacity: 0.35, shadowRadius: 18 },
  bottomLabel: { color: colors.bg, fontFamily: 'monospace', fontWeight: '900', textTransform: 'uppercase', fontSize: 10 },
  bottomCta: { height: 44, borderRadius: 999, backgroundColor: colors.bg, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8 },
  bottomCtaText: { color: colors.acid, fontWeight: '900' },
  successHero: { fontSize: 58, lineHeight: 56, fontWeight: '900', textAlign: 'center' },
  brandTextDark: { color: colors.bg, fontSize: 24, fontWeight: '900', marginBottom: 14 },
  stepRow: { flexDirection: 'row', gap: 5 },
  step: { flex: 1, minHeight: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  stepText: { color: colors.mute, fontFamily: 'monospace', fontSize: 9, fontWeight: '900', textTransform: 'uppercase', textAlign: 'center' },
  orderCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scannerWrap: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 18 },
  scannerFrame: { width: 280, height: 280, borderRadius: 32, borderWidth: 2, borderColor: colors.acid, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'rgba(255,217,61,0.06)' },
  scanLine: { position: 'absolute', top: 64, left: 20, right: 20, height: 3, backgroundColor: colors.coral, borderRadius: 3 },
  roleNav: { position: 'absolute', bottom: 22, alignSelf: 'center', flexDirection: 'row', gap: 8, backgroundColor: colors.surface, borderRadius: 999, padding: 6, borderWidth: 1, borderColor: colors.line },
  moneyHero: { fontSize: 42, lineHeight: 48, fontWeight: '900', marginVertical: 6 },
  kpiValue: { color: colors.text, fontSize: 26, fontWeight: '900', marginTop: 8 }
});
