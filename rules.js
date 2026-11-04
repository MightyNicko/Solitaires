// Reglerna för alla patienser, på svenska och engelska. Bara regelsidan (rules.html) laddar den här filen, så att spelen slipper texterna.
// Varje patiens har samma delar: goal (mål), setup (så ligger korten), steps (så spelar du), end (när spelet är slut) och tips.
// goal, setup och steps har en bild: en lista med kort, tomma platser och pilar, med måtten i enheter där ett kort är 60 × 84.
// Reglerna följer spelens kod. Ändras en regel i ett spel ska den också ändras här.
const RULES = (() => {
  const L = (sv, en) => I18N.lang === 'sv' ? sv : en;
  const S = 0, H = 1, D = 2, C = 3;   // färgerna: spader, hjärter, ruter, klöver
  const A = 1, J = 11, Q = 12, K = 13;
  const FAN = 26;   // så långt ned ett kort ligger på kortet under
  const c = (s, r, x, y) => ({ t: 'c', s, r, x, y });
  const down = (x, y) => ({ t: 'b', x, y });
  const slot = (x, y, txt = '') => ({ t: 'e', x, y, txt });
  const cap = (x, y, txt) => ({ t: 'l', x, y, txt });
  const no = (x, y) => ({ t: 'x', x, y });
  const stock = (x, y) => [down(x, y), cap(x + 30, y + 90, I18N.t('stock'))];
  const waste = (x, y, card) => [card ? c(card[0], card[1], x, y) : slot(x, y), cap(x + 30, y + 90, I18N.t('waste'))];
  const found = () => L('Grund-\nhög', 'Foun-\ndation');
  const empty = () => L('Tom\nplats', 'Empty');
  const gone = () => L('Borta', 'Gone');
  // Korten flyttas med (dx, dy), lyser under rörelsen och får en pil från det första kortet till målet
  function go(cards, dx, dy) {
    const list = [].concat(cards), f = list[0], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
    const cx = f.x + 30, cy = f.y + 42, m = 38;
    return [...list.map(k => ({ ...k, mv: [dx, dy], hi: 1 })),
      { t: 'a', x1: cx + ux * m, y1: cy + uy * m, x2: cx + dx - ux * m, y2: cy + dy - uy * m }];
  }
  // Ett kort från draghögen hamnar på varje kolumn. list: [färg, valör, kolumnens x, y på kolumnen]
  const dealTo = (x0, list) => [...stock(x0, 0), ...list.flatMap(([s, r, x, y]) => ({ ...c(s, r, x0, 0), mv: [x - x0, y], hi: 1 })),
    { t: 'a', x1: x0 + 66, y1: 42, x2: list[0][2] - 6, y2: 42 }];
  const row = (list, y = 0, x0 = 0, gap = 72) => list.map(([s, r], i) => c(s, r, x0 + i * gap, y));
  // Fyra kungar: alla kort i rätt ordning på grundhögarna
  const kings = () => row([[S, K], [H, K], [D, K], [C, K]]);
  // En kolumn med nedvända kort och uppvända ovanpå
  const col = (x, downs, ups, y0 = 0) => [...Array(downs)].map((_, i) => down(x, y0 + i * 14)).concat(ups.map(([s, r], i) => c(s, r, x, y0 + downs * 14 + i * FAN)));
  // En liten pyramid: rader med kort eller tomma platser som överlappar varandra
  const tri = (rows, make) => [...Array(rows)].flatMap((_, i) => [...Array(i + 1)].map((_, k) => make((rows - 1 - i) * 36 + k * 72, i * 46, i, k)));

  return {
    spider: () => ({
      goal: { text: L('Bygg serier från kung till ess i samma färg. En färdig serie tas bort. Du vinner när alla åtta serier är borta.',
                      'Build sequences from king to ace in the same suit. A finished sequence is removed. You win when all eight are gone.'),
              d: [K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2, A].map((r, i) => c(S, r, 0, i * 16)) },
      setup: { text: L('Tio kolumner med 54 kort, där bara det översta kortet i varje kolumn är uppvänt. Resten är draghögen. Du väljer en, två eller fyra färger i menyn.',
                       'Ten columns with 54 cards, and only the top card of each column is face up. The rest is the draw pile. Choose one, two or four suits in the menu.'),
               d: [...stock(0, 0), ...col(90, 3, [[S, 8]]), ...col(162, 3, [[H, 4]]), ...col(234, 3, [[S, Q]]), ...col(306, 3, [[H, 7]])] },
      steps: [
        { title: L('Lägg på ett högre kort', 'Play on a higher card'), text: L('Ett kort får läggas på ett kort som är ett steg högre, oavsett färg.', 'A card may go on a card one rank higher, whatever the suit.'),
          d: [c(S, 8, 0, 0), ...go(c(H, 7, 150, 0), -150, FAN)] },
        { title: L('Flytta en serie', 'Move a sequence'), text: L('Flera kort flyttas tillsammans bara om de ligger i följd och i samma färg.', 'Several cards move together only if they are in order and in the same suit.'),
          d: [c(H, 7, 0, 0), ...go([c(S, 6, 150, 0), c(S, 5, 150, FAN)], -150, FAN)] },
        { title: L('Tom kolumn och dolda kort', 'Empty columns and hidden cards'), text: L('Vilket kort som helst får läggas i en tom kolumn. Ett nedvänt kort vänds upp när det hamnar överst.', 'Any card may go in an empty column. A face-down card turns over when it comes to the top.'),
          d: [slot(150, 0, empty()), down(0, 0), ...go(c(D, 9, 0, FAN), 150, -FAN)] },
        { title: L('Dela ut', 'Deal'), text: L('Tryck på draghögen för att lägga ett nytt kort på varje kolumn. Alla kolumner måste då ha minst ett kort.', 'Tap the draw pile to put a new card on every column. Every column must then hold at least one card.'),
          d: [c(S, 9, 100, 0), c(D, 3, 172, 0), c(C, J, 244, 0), ...dealTo(0, [[H, 5, 100, FAN], [S, Q, 172, FAN], [D, 7, 244, FAN]])] },
      ],
      end: L('Du vinner när alla åtta serier är borta. Spelet tar slut när draghögen är tom och inget drag hjälper längre. Du börjar med 500 poäng. Varje drag kostar 1 poäng och en färdig serie ger 100.',
             'You win when all eight sequences are gone. The game ends when the draw pile is empty and no move helps any more. You start with 500 points. Each move costs 1 point and a finished sequence gives 100.'),
      tips: L('Töm kolumner när du kan, för de är dina bästa platser. Bygg helst i samma färg, för bara sådana serier går att flytta.',
              'Empty columns when you can, since they are your best spots. Build in the same suit when possible, since only those sequences can be moved.'),
    }),

    pyramid: () => ({
      goal: { text: L('Ta bort alla 28 korten i pyramiden, två och två eller kungar ensamma.', 'Remove all 28 cards in the pyramid, in pairs or kings on their own.'),
              d: tri(4, (x, y) => slot(x, y)) },
      setup: { text: L('Pyramiden har sju rader och resten av korten är draghögen. I varianten Dolda rader ligger varannan rad med baksidan upp, och korten vänds när inget ligger på dem.',
                       'The pyramid has seven rows and the other cards are the draw pile. With Hidden rows, every other row lies face down and turns over when nothing covers it.'),
               d: [...tri(3, (x, y, i, k) => c([S, H, D, C][(i + k) % 4], [10, 3, 9, 6, 12, 2][(i * 2 + k) % 6], x + 96, y)), ...stock(0, 0)] },
      steps: [
        { title: L('Par som blir 13', 'Pairs that make 13'), text: L('Två fria kort som blir 13 tillsammans tas bort. Ess är 1, knekt 11 och dam 12.', 'Two free cards that add up to 13 are removed. Ace is 1, jack 11 and queen 12.'),
          d: [slot(230, 0, gone()), ...go(c(H, 6, 0, 0), 230, 0), ...go(c(S, 7, 80, 0), 150, 0)] },
        { title: L('Kungar tas bort ensamma', 'Kings go alone'), text: L('En fri kung är 13 redan själv. Tryck på den så försvinner den.', 'A free king already counts as 13. Tap it and it is gone.'),
          d: [slot(170, 0, gone()), ...go(c(D, K, 0, 0), 170, 0)] },
        { title: L('Fria kort', 'Free cards'), text: L('Ett kort är fritt när inget ligger på det. Du får också para ett kort med det enda kort som ligger på det.', 'A card is free when nothing covers it. You may also pair a card with the only card covering it.'),
          d: [c(C, 4, 36, 0), { ...c(H, 9, 0, 46), hi: 1 }, { ...c(S, 2, 72, 46), hi: 1 }] },
        { title: L('Dra från draghögen', 'Draw from the pile'), text: L('Tryck på draghögen så hamnar ett kort överst på kasthögen. Det kortet kan också paras. Har du varv kvar vänds kasthögen när draghögen är tom.', 'Tap the draw pile and a card lands on top of the discard pile. That card can also be paired. If you have passes left, the discard pile turns over when the draw pile is empty.'),
          d: [...stock(0, 0), ...waste(170, 0), ...go(c(C, 8, 0, 0), 170, 0)] },
      ],
      end: L('Du vinner när pyramiden är tom. Spelet tar slut när draghögen är tom och inget par eller kung går att ta, inte heller efter ett nytt varv. Pyramidkort ger 10 poäng, kort från kasthögen 5 och en tom pyramid 250 extra.',
             'You win when the pyramid is empty. The game ends when the draw pile is empty and no pair or king can be taken, even after another pass. Pyramid cards give 10 points, cards from the discard pile 5 and an empty pyramid 250 extra.'),
      tips: L('Se efter vilka kort ett par frigör innan du tar det. Par helst två pyramidkort, så att du sparar kasthögens kort till senare.',
              'Check which cards a pair sets free before you take it. Prefer pairing two pyramid cards, so that the discard pile is saved for later.'),
    }),

    golf: () => ({
      goal: { text: L('Töm alla sju kolumner genom att lägga korten på kasthögen.', 'Clear all seven columns by moving the cards to the discard pile.'),
              d: [...[0, 72, 144, 216].map(x => slot(x, 0)), ...waste(108, 104, [S, 7])] },
      setup: { text: L('Sju kolumner med fem uppvända kort var. Resten är draghögen, och ett kort från den startar kasthögen.', 'Seven columns with five face-up cards each. The rest is the draw pile, and one of its cards starts the discard pile.'),
               d: [...[0, 72, 144, 216].flatMap((x, i) => [c([S, H][i % 2], 3 + i, x, 0), c([D, C][i % 2], 9 - i, x, 20), c([H, S][i % 2], 6 + i, x, 40)]), ...stock(72, 140), ...waste(144, 140, [D, 4])] },
      steps: [
        { title: L('Lägg på kasthögen', 'Play to the discard pile'), text: L('Det översta kortet i en kolumn får läggas om det är ett steg högre eller lägre, oavsett färg.', 'The top card of a column may be played if it is one rank higher or lower, whatever the suit.'),
          d: [...waste(170, 0, [S, 7]), ...go(c(H, 8, 0, 0), 170, 0)] },
        { title: L('Dra ett kort', 'Draw a card'), text: L('Passar inget kort trycker du på draghögen. Det nya kortet hamnar överst på kasthögen och serien bryts.', 'If nothing fits, tap the draw pile. The new card lands on top of the discard pile and the streak is broken.'),
          d: [...stock(0, 0), ...waste(170, 0), ...go(c(D, 4, 0, 0), 170, 0)] },
        { title: L('Stopp vid kung', 'A king stops play'), text: L('I Klassisk får inget läggas på en kung. I Runt hörnet hänger ess och kung ihop: ess går på kung och kung på ess.', 'In Classic nothing may go on a king. In Round the corner ace and king connect: an ace goes on a king and a king on an ace.'),
          d: [c(H, Q, 0, 0), ...waste(170, 0, [S, K]), { t: 'a', x1: 66, y1: 42, x2: 164, y2: 42 }, no(115, 42)] },
      ],
      end: L('Du vinner när alla kolumner är tomma. Spelet tar slut när draghögen är tom och inget kort passar. Varje kort ger 10 poäng plus 5 för varje kort i följd. Tomma kolumner ger 250 extra och 25 för varje kort kvar i draghögen.',
             'You win when all columns are empty. The game ends when the draw pile is empty and nothing fits. Each card gives 10 points plus 5 for each card in a row. Empty columns give 250 extra and 25 for each card left in the draw pile.'),
      tips: L('Leta efter långa serier innan du lägger ett kort, och spara draghögen så länge du kan.', 'Look for long streaks before you play a card, and save the draw pile as long as you can.'),
    }),

    klondike: () => ({
      goal: { text: L('Bygg upp alla fyra färger från ess till kung på grundhögarna.', 'Build all four suits from ace to king on the foundations.'), d: kings() },
      setup: { text: L('Sju kolumner med ett till sju kort, där det översta är uppvänt. Resten är draghögen, och de fyra grundhögarna är tomma.', 'Seven columns with one to seven cards, and the top one is face up. The rest is the draw pile, and the four foundations are empty.'),
               d: [...col(0, 0, [[S, 8]]), ...col(72, 1, [[H, 6]]), ...col(144, 2, [[S, J]]), ...col(216, 3, [[D, 3]])] },
      steps: [
        { title: L('Bygg i kolumnerna', 'Build in the columns'), text: L('Lägg ett kort på ett som är ett steg högre och har motsatt färg. Uppvända kort i ordning flyttas tillsammans.', 'Put a card on one that is one rank higher and of the opposite colour. Face-up cards in order move together.'),
          d: [c(S, 7, 0, 0), ...go(c(H, 6, 150, 0), -150, FAN)] },
        { title: L('Lägg på grundhögarna', 'Play to the foundations'), text: L('Ess startar en grundhög. Sedan bygger du uppåt i samma färg: 2, 3, 4 och så vidare.', 'An ace starts a foundation. Then build up in the same suit: 2, 3, 4 and so on.'),
          d: [c(D, A, 170, 0), cap(200, 90, L('Grundhög', 'Foundation')), ...go(c(D, 2, 0, 0), 170, 0)] },
        { title: L('Dra från draghögen', 'Draw from the pile'), text: L('Tryck på draghögen för att vända upp ett eller tre kort, enligt din nivå. Översta kortet på kasthögen går att spela. Har du varv kvar vänds kasthögen när draghögen är tom.', 'Tap the draw pile to turn over one or three cards, depending on your level. The top card of the discard pile can be played. If you have passes left, the discard pile turns over when the draw pile is empty.'),
          d: [...stock(0, 0), ...waste(170, 0), ...go(c(C, 9, 0, 0), 170, 0)] },
        { title: L('Tom kolumn', 'Empty column'), text: L('Bara en kung får läggas i en tom kolumn, och korten på den följer med.', 'Only a king may go in an empty column, and the cards on it come along.'),
          d: [slot(170, 0, empty()), ...go(c(S, K, 0, 0), 170, 0)] },
      ],
      end: L('Du vinner när alla kort ligger på grundhögarna. Spelet tar slut när draghögen är tom och inget drag hjälper längre. Kort till grundhög ger 10 poäng, kort från kasthögen till kolumn 5, ett vänt kort 5, och ett kort tillbaka från grundhög kostar 15.',
             'You win when all cards are on the foundations. The game ends when the draw pile is empty and no move helps any more. A card to a foundation gives 10 points, from the discard pile to a column 5, a card turned over 5, and a card back from a foundation costs 15.'),
      tips: L('Vänd upp dolda kort så snart du kan. Töm bara en kolumn om du har en kung att lägga där.', 'Turn over hidden cards as soon as you can. Only empty a column if you have a king to put there.'),
    }),

    freecell: () => ({
      goal: { text: L('Bygg upp alla fyra färger från ess till kung på grundhögarna.', 'Build all four suits from ace to king on the foundations.'), d: kings() },
      setup: { text: L('Alla 52 kort ligger uppvända i åtta kolumner. Överst finns fria celler, fyra eller två enligt din nivå, och fyra tomma grundhögar.', 'All 52 cards lie face up in eight columns. At the top are free cells, four or two depending on your level, and four empty foundations.'),
               d: [slot(0, 0), slot(72, 0), cap(66, 90, L('Fria celler', 'Free cells')), slot(180, 0), slot(252, 0), cap(246, 90, L('Grundhögar', 'Foundations')),
                   ...[0, 72, 144, 216, 288].flatMap((x, i) => [c([S, H, C, D, S][i], 9 - i, x, 116), c([D, C, H, S, H][i], 4 + i, x, 116 + FAN)])] },
      steps: [
        { title: L('Bygg i kolumnerna', 'Build in the columns'), text: L('Lägg ett kort på ett som är ett steg högre och har motsatt färg.', 'Put a card on one that is one rank higher and of the opposite colour.'),
          d: [c(C, 9, 0, 0), ...go(c(H, 8, 150, 0), -150, FAN)] },
        { title: L('Fria celler', 'Free cells'), text: L('En fri cell rymmer ett kort, vilket som helst. Använd den för att komma åt kortet under.', 'A free cell holds one card, any card. Use it to reach the card below.'),
          d: [slot(170, 0, L('Fri\ncell', 'Free\ncell')), c(S, 5, 0, 0), ...go(c(D, 10, 0, FAN), 170, -FAN)] },
        { title: L('Lägg på grundhögarna', 'Play to the foundations'), text: L('Ess startar en grundhög. Sedan bygger du uppåt i samma färg.', 'An ace starts a foundation. Then build up in the same suit.'),
          d: [slot(170, 0, found()), ...go(c(D, A, 0, 0), 170, 0)] },
        { title: L('Flytta flera kort', 'Move several cards'), text: L('En ordnad serie kan flyttas om det finns plats. Antalet kort är (lediga celler + 1), dubblerat för varje tom kolumn. Vilket kort som helst får läggas i en tom kolumn.', 'An ordered sequence can move if there is room. The number of cards is (free cells + 1), doubled for each empty column. Any card may go in an empty column.'),
          d: [c(C, 7, 0, 0), ...go([c(D, 6, 170, 0), c(S, 5, 170, FAN)], -170, FAN)] },
      ],
      end: L('Du vinner när alla kort ligger på grundhögarna. Spelet tar slut när inget kort kan flyttas längre. Varje kort på en grundhög ger 10 poäng.', 'You win when all cards are on the foundations. The game ends when no card can be moved any more. Each card on a foundation gives 10 points.'),
      tips: L('Håll cellerna lediga så länge du kan. En tom kolumn är värd mer än en ledig cell.', 'Keep the cells free as long as you can. An empty column is worth more than a free cell.'),
    }),

    tripeaks: () => ({
      goal: { text: L('Töm alla tre topparna genom att lägga korten på kasthögen.', 'Clear all three peaks by moving the cards to the discard pile.'),
              d: [...[0, 150, 300].flatMap(x => [slot(x, 0), cap(x + 30, 90, gone())])] },
      setup: { text: L('28 kort ligger som tre toppar, där bara bottenraden är uppvänd. Resten är draghögen, och ett kort från den startar kasthögen.', 'Twenty-eight cards form three peaks, and only the bottom row is face up. The rest is the draw pile, and one of its cards starts the discard pile.'),
               d: [...tri(2, (x, y, i) => i ? c([S, H][x % 2 ? 1 : 0], x ? 9 : 4, x, y) : down(x, y)), ...tri(2, (x, y, i) => i ? c(x ? D : C, x ? 2 : J, x + 150, y) : down(x + 150, y)), ...stock(40, 150), ...waste(160, 150, [D, 6])] },
      steps: [
        { title: L('Lägg på kasthögen', 'Play to the discard pile'), text: L('Ett fritt kort får läggas om det är ett steg högre eller lägre, oavsett färg.', 'A free card may be played if it is one rank higher or lower, whatever the suit.'),
          d: [...waste(170, 0, [D, 6]), ...go(c(S, 7, 0, 0), 170, 0)] },
        { title: L('Korten vänds upp', 'Cards turn over'), text: L('Ett kort vänds upp och blir fritt när inget längre ligger på det.', 'A card turns over and becomes free when nothing covers it any more.'),
          d: [down(36, 0), { ...c(H, 9, 0, 46), hi: 1 }, slot(72, 46, gone())] },
        { title: L('Dra ett kort', 'Draw a card'), text: L('Passar inget kort trycker du på draghögen. Det nya kortet hamnar överst på kasthögen och serien bryts.', 'If nothing fits, tap the draw pile. The new card lands on top of the discard pile and the streak is broken.'),
          d: [...stock(0, 0), ...waste(170, 0), ...go(c(C, 4, 0, 0), 170, 0)] },
        { title: L('Ess och kung', 'Ace and king'), text: L('I Klassisk hänger ess och kung inte ihop. I Runt hörnet går ess på kung och kung på ess.', 'In Classic ace and king do not connect. In Round the corner an ace goes on a king and a king on an ace.'),
          d: [c(H, A, 0, 0), ...waste(170, 0, [S, K]), { t: 'a', x1: 66, y1: 42, x2: 164, y2: 42 }, no(115, 42)] },
      ],
      end: L('Du vinner när alla tre topparna är tomma. Spelet tar slut när draghögen är tom och inget kort passar. Varje kort ger 10 poäng plus 5 för varje kort i följd. En tömd topp ger 100 extra, och tre tömda toppar 250 och 25 för varje kort kvar i draghögen.',
             'You win when all three peaks are empty. The game ends when the draw pile is empty and nothing fits. Each card gives 10 points plus 5 for each card in a row. A cleared peak gives 100 extra, and three cleared peaks 250 and 25 for each card left in the draw pile.'),
      tips: L('Välj det kort som vänder upp flest nya kort. Spara draghögen, för långa serier ger mest poäng.', 'Choose the card that turns over the most new cards. Save the draw pile, since long streaks give the most points.'),
    }),

    yukon: () => ({
      goal: { text: L('Bygg upp alla fyra färger från ess till kung på grundhögarna.', 'Build all four suits from ace to king on the foundations.'), d: kings() },
      setup: { text: L('Alla 52 kort ligger i sju kolumner och det finns ingen draghög. Första kolumnen har ett kort. De andra har nedvända kort med fem uppvända ovanpå.', 'All 52 cards lie in seven columns and there is no draw pile. The first column has one card. The others have face-down cards with five face-up cards on top.'),
               d: [...col(0, 0, [[S, 9]]), ...col(72, 1, [[H, 3], [C, 8], [D, Q], [S, 2], [H, 7]]), ...col(144, 2, [[D, 5], [S, K], [C, 4], [H, J], [D, 10]])] },
      steps: [
        { title: L('Flytta vilket uppvänt kort som helst', 'Move any face-up card'), text: L('Alla kort ovanpå följer med, även om de inte ligger i ordning. Det flyttade kortet ska vara ett steg lägre än kortet det hamnar på.', 'All cards on top come along, even if they are not in order. The moved card must be one rank lower than the card it lands on.'),
          d: [c(S, 8, 0, 0), ...go([c(H, 7, 170, 0), c(C, K, 170, FAN), c(D, 3, 170, FAN * 2)], -170, FAN)] },
        { title: L('Färgen avgör', 'The colour decides'), text: L('I Klassisk bygger du i omväxlande röd och svart. I Ryska bygger du i samma färg, vilket är mycket svårare.', 'In Classic you build in alternating red and black. In Russian you build in the same suit, which is much harder.'),
          d: [c(C, 9, 0, 0), { ...c(H, 8, 0, FAN), hi: 1 }, cap(30, 122, L('Klassisk', 'Classic')), c(C, 9, 130, 0), { ...c(C, 8, 130, FAN), hi: 1 }, cap(160, 122, L('Ryska', 'Russian'))] },
        { title: L('Lägg på grundhögarna', 'Play to the foundations'), text: L('Ess startar en grundhög. Sedan bygger du uppåt i samma färg.', 'An ace starts a foundation. Then build up in the same suit.'),
          d: [slot(170, 0, found()), ...go(c(S, A, 0, 0), 170, 0)] },
        { title: L('Tom kolumn', 'Empty column'), text: L('Bara en kung får läggas i en tom kolumn. Ett nedvänt kort vänds upp när det hamnar överst.', 'Only a king may go in an empty column. A face-down card turns over when it comes to the top.'),
          d: [slot(170, 0, empty()), ...go(c(H, K, 0, 0), 170, 0)] },
      ],
      end: L('Du vinner när alla kort ligger på grundhögarna. Spelet tar slut när inget drag hjälper längre. Kort till grundhög ger 10 poäng, ett vänt kort 5, och ett kort tillbaka från grundhög kostar 15.', 'You win when all cards are on the foundations. The game ends when no move helps any more. A card to a foundation gives 10 points, a card turned over 5, and a card back from a foundation costs 15.'),
      tips: L('Börja med kolumnerna som har flest dolda kort. Lägg inte upp kort på grundhögarna för tidigt, för du kan behöva dem att bygga på.', 'Start with the columns that have the most hidden cards. Do not play cards to the foundations too early, since you may need them to build on.'),
    }),

    forty: () => ({
      goal: { text: L('Du spelar med två kortlekar. Bygg upp alla åtta grundhögar från ess till kung i samma färg.', 'You play with two decks. Build all eight foundations from ace to king in the same suit.'),
              d: [...kings(), ...row([[S, K], [H, K], [D, K], [C, K]], 100)] },
      setup: { text: L('Tio kolumner med fyra uppvända kort var. Resten är draghögen, och de åtta grundhögarna är tomma.', 'Ten columns with four face-up cards each. The rest is the draw pile, and the eight foundations are empty.'),
               d: [0, 72, 144, 216].flatMap((x, i) => [0, 1, 2, 3].map(k => c((i + k) % 4, 3 + ((i * 3 + k * 2) % 9), x, k * FAN))) },
      steps: [
        { title: L('Bygg i kolumnerna', 'Build in the columns'), text: L('Lägg ett kort på ett som är ett steg högre i samma färg. Bara ett kort får flyttas åt gången.', 'Put a card on one that is one rank higher in the same suit. Only one card may move at a time.'),
          d: [c(H, 9, 0, 0), ...go(c(H, 8, 150, 0), -150, FAN)] },
        { title: L('Tom kolumn', 'Empty column'), text: L('Vilket kort som helst får läggas i en tom kolumn.', 'Any card may go in an empty column.'),
          d: [slot(170, 0, empty()), c(C, 2, 0, 0), ...go(c(D, 6, 0, FAN), 170, -FAN)] },
        { title: L('Lägg på grundhögarna', 'Play to the foundations'), text: L('Ess startar en grundhög. Sedan bygger du uppåt i samma färg. Det finns två grundhögar per färg.', 'An ace starts a foundation. Then build up in the same suit. There are two foundations per suit.'),
          d: [c(S, A, 170, 0), cap(200, 90, L('Grundhög', 'Foundation')), ...go(c(S, 2, 0, 0), 170, 0)] },
        { title: L('Dra från draghögen', 'Draw from the pile'), text: L('Tryck på draghögen för att vända upp ett kort. Översta kortet på kasthögen går att spela. Har du ett varv kvar vänds kasthögen när draghögen är tom.', 'Tap the draw pile to turn over one card. The top card of the discard pile can be played. If you have a pass left, the discard pile turns over when the draw pile is empty.'),
          d: [...stock(0, 0), ...waste(170, 0), ...go(c(D, 10, 0, 0), 170, 0)] },
      ],
      end: L('Du vinner när alla 104 kort ligger på grundhögarna. Spelet tar slut när draghögen är tom och inget drag hjälper längre. Kort till grundhög ger 10 poäng och kort från kasthögen till kolumn 5.', 'You win when all 104 cards are on the foundations. The game ends when the draw pile is empty and no move helps any more. A card to a foundation gives 10 points and a card from the discard pile to a column 5.'),
      tips: L('Sikta på att tömma en kolumn tidigt, för då kan du flytta om korten mycket friare. Planera i förväg, eftersom bara ett kort får flyttas åt gången.', 'Aim to empty a column early, since it lets you rearrange cards much more freely. Plan ahead, since only one card may move at a time.'),
    }),

    idioten: () => ({
      goal: { text: L('Kasta alla kort utom de fyra essen. Det lyckas sällan, så ju fler kastade kort desto bättre. 48 kastade kort är en vinst.', 'Discard every card except the four aces. It rarely works out, so the more discarded cards the better. 48 discarded cards is a win.'),
              d: row([[S, A], [H, A], [D, A], [C, A]]) },
      setup: { text: L('Fyra högar med ett uppvänt kort var. Resten av leken är draghögen.', 'Four piles with one face-up card each. The rest of the deck is the draw pile.'),
               d: [...stock(0, 0), ...row([[S, 9], [H, 5], [C, K], [D, 4]], 0, 90)] },
      steps: [
        { title: L('Kasta ett kort', 'Discard a card'), text: L('Har två översta kort samma färg? Tryck på det lägre, så kastas det. Ess är högst.', 'Do two top cards have the same suit? Tap the lower one and it is discarded. Aces are highest.'),
          d: [c(C, K, 72, 0), c(H, A, 144, 0), ...waste(250, 0), ...go(c(C, 7, 0, 0), 250, 0)] },
        { title: L('Flytta till tom plats', 'Move to an empty pile'), text: L('Ett översta kort får flyttas till en tom plats. Då kommer kortet under fram.', 'A top card may move to an empty pile. The card below then comes to the top.'),
          d: [slot(170, 0, empty()), c(S, 9, 0, 0), ...go(c(H, 5, 0, FAN), 170, -FAN)] },
        { title: L('Dela ut', 'Deal'), text: L('Tryck på draghögen när du vill. Ett nytt kort hamnar på varje hög, även de tomma.', 'Tap the draw pile whenever you like. A new card lands on every pile, even the empty ones.'),
          d: [c(S, 9, 100, 0), c(D, 6, 172, 0), slot(244, 0), ...dealTo(0, [[H, 8, 100, FAN], [S, 3, 172, FAN], [D, Q, 244, 0]])] },
      ],
      end: L('Spelet tar slut när draghögen är tom och inget kort går att kasta, inte heller efter flyttar till tomma platser. Är bara essen kvar har du vunnit. Poängen är antalet kastade kort, och även förlorade spel kommer på topplistan.', 'The game ends when the draw pile is empty and no card can be discarded, even after moves to empty piles. If only the aces are left, you have won. The score is the number of discarded cards, and lost games also reach the top list.'),
      tips: L('Spara tomma platser till höga kort. Flytta gärna ett ess eller en kung, sällan en tvåa. Kortkoll visar vilka kort som återstår.', 'Save empty piles for high cards. Move an ace or a king rather than a two. The card tracker shows which cards remain.'),
    }),
  };
})();
