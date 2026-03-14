import 'dotenv/config'

import { getPayload } from 'payload'
import config from '../src/payload.config'

function paragraphNode(text: string): Record<string, unknown> {
  return {
    type: 'paragraph',
    version: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children: [
      {
        type: 'text',
        version: 1,
        text,
        format: 0,
        style: '',
        mode: 'normal',
        detail: 0,
      },
    ],
  }
}

function textToLexical(text: string): Record<string, unknown> {
  const paragraphs = text
    .split(/\n\s*\n/g)
    .map((line) => line.trim())
    .filter(Boolean)

  return {
    root: {
      type: 'root',
      version: 1,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      children:
        paragraphs.length > 0 ? paragraphs.map((line) => paragraphNode(line)) : [paragraphNode('')],
    },
  }
}

const trekSlug = 'tamang-heritage-langtang-valley-trek-11-days'

const trekData = {
  name: 'タマン・ヘリテージ＆ランタン谷トレッキング - 11日間',
  slug: trekSlug,
  days: '11日間',
  difficulty: '中級' as const,
  price: 950,
  image: 39,
  gallery: [{ image: 40 }, { image: 41 }],
  maxAltitude: '5,033m（ツェルコ・リ）',
  bestSeason: '春（3月〜5月）・秋（9月〜11月）',
  startEndPoint: 'Kathmandu / Kathmandu',
  trekAccommodation: 'ホームステイ・ティーハウス・ホテル',
  trekMeals: '朝食、昼食、夕食 / 晩ご飯',
  groupSize: '1〜20名',
  description: 'タマン族の文化体験とランタン谷の絶景を11日間で巡る、中級者向けトレッキングです。',
  overview: textToLexical(
    'タマン・ヘリテージ＆ランタン谷トレッキングは、ネパールのランタン地域で楽しめる最も豊かな文化体験と自然美が凝縮された旅です。カトマンズから車で7〜8時間のシャブルベシを起点に、タマン族の伝統的な村々、天然温泉、ナグタリ展望台、そしてランタン谷の雄大なヒマラヤ絶景を11日間で巡ります。エベレスト・ベースキャンプやアンナプルナとは一線を画す、人が少なく静かでありながら感動に満ちたヒマラヤ体験がここにあります。',
  ),
  detailedOverview: textToLexical(
    [
      'ネパールのトレッキングというと、エベレスト・ベースキャンプやアンナプルナ・サーキットが頭に浮かぶ方も多いでしょう。しかし、カトマンズのすぐ北に位置するランタン地域には、まだあまり知られていない宝石のような道があります。それがタマン・ヘリテージ・ルートです。このルートは単なる山歩きではなく、数百年の歴史を持つタマン族の村々を歩きながら、彼らの暮らし・信仰・食文化にじかに触れる旅です。',
      '旅の前半は、シャブルベシを出発してガトラン、タトパニ、ナグタリ、トゥマン、ブリディムと、タマン族の伝統が息づく集落を一つひとつ丁寧に巡ります。天然温泉で体を温め、古いゴンパや祈祷旗をくぐりながら進む道は、標高こそ高くないものの、文化的な豊かさでは他のどのトレッキングルートにも負けません。各村で地元の家庭に宿泊するホームステイ体験は、旅の思い出を格別なものにしてくれます。',
      '旅の後半は、いよいよ本格的なランタン谷へと踏み込みます。ラマホテルを経てランタン村、そしてキャンジン・ゴンパへ。雪をかぶったランタン・リルン（7,227m）が真正面に迫り、その圧倒的な存在感に思わず言葉を失うでしょう。ツェルコ・リ（5,033m）への日帰りハイキングでは、ヒマラヤの360度パノラマを独り占めする贅沢な体験が待っています。このトレッキングは、文化・自然・冒険の三つすべてを一度に楽しめる、ネパールで最も充実したトレッキング体験の一つです。',
    ].join('\n\n'),
  ),
  highlights: [
    {
      text: textToLexical(
        'ガトラン村、タトパニ、トゥマン、ブリディムなど古くからのタマン族の集落を訪れ、その伝統・文化・宗教をじかに体感できます。',
      ),
    },
    {
      text: textToLexical(
        'タトパニの天然温泉では疲れた体を癒し、地元の人々と自然なふれあいが生まれます。',
      ),
    },
    {
      text: textToLexical(
        'ナグタリ展望台（3,165m）からは、ガネーシュ・ヒマール、ランタン・リルン、シシャパンマなどの名峰が一望できます。',
      ),
    },
    {
      text: textToLexical(
        'キャンジン・ゴンパでは古い仏教寺院と伝統的なヤクのチーズ工場を見学でき、チベット文化の息吹を感じられます。',
      ),
    },
    {
      text: textToLexical(
        'ツェルコ・リ（5,033m）の山頂からは360度の大パノラマが広がり、このトレッキング最大のハイライトとなります。',
      ),
    },
    {
      text: textToLexical(
        'タマン・ヘリテージ・ルートは、エベレストやアンナプルナと比べて人が少なく、純粋なヒマラヤの自然と人々のぬくもりをより深く感じられます。',
      ),
    },
  ],
  itinerary: [
    {
      day: 1,
      title: 'カトマンズ到着（1,400m）',
      description: textToLexical(
        'トリブバン国際空港に到着後、担当者の出迎えでタメルのホテルへ移動します。チェックイン後は装備確認と最終準備を行い、余裕があればタメル散策へ。夕食はネパール料理を楽しみながら、これから始まる旅への期待を高めます。',
      ),
      elevation: '1,400m',
      meals: ['dinner'] as const,
      accommodation: 'ホテル（カトマンズ）',
    },
    {
      day: 2,
      title: 'カトマンズ → シャブルベシ（1,460m）',
      description: textToLexical(
        '早朝に出発し、トリスリ川沿いの景観を楽しみながら約7〜8時間でシャブルベシへ向かいます。段々畑や小集落を通過し、ランタン国立公園の入口に位置する町へ到着後、翌日の行動に備えて休息します。',
      ),
      elevation: '1,460m',
      distance: '車移動 7〜8時間',
      meals: ['breakfast', 'lunch', 'dinner'] as const,
      accommodation: 'ホテル',
    },
    {
      day: 3,
      title: 'シャブルベシ → ガトラン村（2,238m）',
      description: textToLexical(
        'トレッキング初日。急な上りと森の道を進み、バンジャンからガネーシュ・ヒマールやゴサインクンド方面の眺望を楽しみます。その後ガトラン村へ向かい、タマン族の伝統集落とゴンパ周辺を見学します。',
      ),
      elevation: '2,238m',
      distance: '5〜6時間',
      meals: ['breakfast', 'lunch', 'dinner'] as const,
      accommodation: 'ティーハウス／ホームステイ',
    },
    {
      day: 4,
      title: 'ガトラン → タトパニ（2,380m）',
      description: textToLexical(
        '仏教のチョルテンやマニ壁を抜け、松とシャクナゲの森を下ります。橋を渡ってゴンガンを経由し、天然温泉で有名なタトパニへ。到着後は温泉で疲労回復し、静かな山村で一夜を過ごします。',
      ),
      elevation: '2,380m',
      distance: '5〜6時間',
      meals: ['breakfast', 'lunch', 'dinner'] as const,
      accommodation: 'ティーハウス／ホームステイ',
    },
    {
      day: 5,
      title: 'タトパニ → ナグタリ（3,165m）→ トゥマン（2,238m）',
      description: textToLexical(
        'ナグタリ展望台を目指して登り、ガネーシュ・ヒマール、ランタン・リルンなどの壮大な山並みを展望します。昼食後は深い森を下ってトゥマン村へ。古い寺院やストゥーパが残る美しい村で宿泊します。',
      ),
      elevation: '最高到達 3,165m（宿泊 2,238m）',
      distance: '6〜7時間',
      meals: ['breakfast', 'lunch', 'dinner'] as const,
      accommodation: 'ティーハウス／ホームステイ',
    },
    {
      day: 6,
      title: 'トゥマン → ブリディム村（2,239m）',
      description: textToLexical(
        '比較的ゆったりした行程。川を渡りリンリン村を経由して、再び森林地帯を登ってブリディムへ向かいます。チベット文化の影響が残る村で、古い仏教寺院や地元生活の雰囲気を体験します。',
      ),
      elevation: '2,239m',
      distance: '4〜5時間',
      meals: ['breakfast', 'lunch', 'dinner'] as const,
      accommodation: 'ティーハウス／ホームステイ',
    },
    {
      day: 7,
      title: 'ブリディム → ラマホテル（2,480m）',
      description: textToLexical(
        'この日からランタン谷ルートへ合流。シェルパ・ガウン方面の尾根で山並みの展望を楽しみ、リンチェ・ダンダを経由してラマホテルへ下ります。タマン・ヘリテージ区間の達成感を感じる一日です。',
      ),
      elevation: '2,480m',
      distance: '5〜6時間',
      meals: ['breakfast', 'lunch', 'dinner'] as const,
      accommodation: 'ティーハウス',
    },
    {
      day: 8,
      title: 'ラマホテル → ランタン村（3,430m）',
      description: textToLexical(
        'ランタン川沿いの森を登り、ゴダ・タベラで休憩後、タンシェップを通ってランタン村へ。背後にそびえるランタン・リルンの景観と、村のあたたかな雰囲気が印象的な一日です。',
      ),
      elevation: '3,430m',
      distance: '5〜6時間',
      meals: ['breakfast', 'lunch', 'dinner'] as const,
      accommodation: 'ティーハウス',
    },
    {
      day: 9,
      title: 'ランタン村 → キャンジン・ゴンパ（3,870m）',
      description: textToLexical(
        '比較的短い行程で高所へ。高山草原や小さな集落跡を抜けてキャンジン・ゴンパへ向かいます。到着後は寺院やヤクチーズ工場を見学し、翌日の高所行動に向けて高度順応を行います。',
      ),
      elevation: '3,870m',
      distance: '3〜4時間',
      meals: ['breakfast', 'lunch', 'dinner'] as const,
      accommodation: 'ロッジ',
    },
    {
      day: 10,
      title: 'キャンジン・ゴンパ → ツェルコ・リ（5,033m）→ ラマホテル',
      description: textToLexical(
        '夜明け前に出発しツェルコ・リ山頂を目指します。急登の先にはランタン・リルン、ヤラ・ピーク、シシャパンマなどを望む360度パノラマが広がります。下山後はキャンジンで昼食を取り、ラマホテルまで戻ります。',
      ),
      elevation: '最高到達 5,033m（宿泊 2,480m）',
      distance: '8〜9時間',
      meals: ['breakfast', 'lunch', 'dinner'] as const,
      accommodation: 'ティーハウス',
    },
    {
      day: 11,
      title: 'ラマホテル → シャブルベシ → カトマンズ',
      description: textToLexical(
        '最終日は早朝出発でシャブルベシへ下山し、その後バスまたはジープでカトマンズへ戻ります。帰着後は旅を振り返りながら、タメルでの自由時間や買い物を楽しめます。',
      ),
      elevation: '1,400m（カトマンズ）',
      distance: '下山＋車移動 6〜7時間',
      meals: ['breakfast', 'lunch'] as const,
      accommodation: 'ホテル',
    },
  ],
  includes: [
    { text: textToLexical('全食事（朝食・昼食・夕食）—トレッキング中は1日3食') },
    { text: textToLexical('カトマンズ発着のバス代またはジープ代（カトマンズ↔シャブルベシ 往復）') },
    { text: textToLexical('認定英語ガイド（ランタン国立公園登録済み）') },
    { text: textToLexical('ポーター（2名のトレッカーに対し1名のポーター）') },
    { text: textToLexical('ランタン国立公園入園許可証（LAPA）') },
    {
      text: textToLexical('TIMSカード（トレッカーズ・インフォメーション・マネジメント・システム）'),
    },
    { text: textToLexical('ファーストエイドキット') },
    { text: textToLexical('カトマンズでのホテル宿泊費') },
    { text: textToLexical('トレッキング中の全ティーハウス・ホームステイ宿泊費') },
    { text: textToLexical('ガイド・ポーターの給与・食費・宿泊費・保険') },
    { text: textToLexical('ネパール政府税および地方税') },
  ],
  excludes: [
    { text: textToLexical('ネパールまでの国際線航空運賃') },
    { text: textToLexical('ネパール観光ビザ料金') },
    { text: textToLexical('アルコール・ソフトドリンク・ミネラルウォーター') },
    { text: textToLexical('Wi-Fi、デバイス充電、ホットシャワー代（別途請求の場合あり）') },
    { text: textToLexical('個人費用・医療費') },
    { text: textToLexical('緊急救助・緊急ヘリコプター避難費用（旅行保険での対応を推奨）') },
    {
      text: textToLexical(
        'ガイドおよびポーターへのチップ（推奨：ガイド$10〜15/日、ポーター$7〜10/日）',
      ),
    },
    { text: textToLexical('カトマンズでの追加宿泊費') },
    { text: textToLexical('タトパニ温泉の入浴料（別途少額）') },
  ],
  addonsDescription: textToLexical(
    'すべてのトレッカーは、自分だけの旅のビジョンを持っています。あなたの旅をさらに豊かにするために、さまざまなオプションとアップグレードをご用意しています。',
  ),
  addons: [
    {
      label: 'カトマンズでの追加宿泊＆観光',
      description: textToLexical(
        'トレッキング前後の滞在延長に合わせ、追加ホテル宿泊とガイド付き観光をご手配します。パシュパティナート寺院、ボダナート、スワヤンブナート、バクタプルなどの世界遺産巡りも可能です。',
      ),
    },
    {
      label: 'ヘリコプター帰還オプション',
      description: textToLexical(
        'シャブルベシからの長距離陸路移動を省き、ヘリコプターでカトマンズへ帰還できます。移動時間短縮とランタン山脈の空撮景観を同時に楽しめます。',
      ),
    },
    {
      label: 'プライベートガイド＆ポーターのアップグレード',
      description: textToLexical(
        '専任ガイド、追加ポーター、文化解説に強い専門ガイドなどを追加可能です。荷物量や旅のスタイルに応じて柔軟に調整します。',
      ),
    },
    {
      label: '宿泊施設のアップグレード',
      description: textToLexical(
        'カトマンズでの上位ホテル手配や、トレイル沿い一部ティーハウスでの設備向上プラン（バス付きツイン、温水シャワー等）に対応します。',
      ),
    },
    {
      label: 'トレッキング用品レンタル',
      description: textToLexical(
        '寝袋、トレッキングポール、ダウンジャケット、ゲイターなど、必要装備のレンタルをタメルでご案内します。',
      ),
    },
    {
      label: 'ゴサインクンド湖サイドトリップ',
      description: textToLexical(
        'ランタン谷トレッキング後に神聖なゴサインクンド湖（4,380m）への延長が可能です。精神性の高い巡礼的トレッキングとして人気があります。',
      ),
    },
    {
      label: '文化体験オプション',
      description: textToLexical(
        'ネワリ料理教室、ゴンパ瞑想、タンカ絵画ワークショップ、タマン族ホームステイ延長など、文化理解を深める体験を追加できます。',
      ),
    },
  ],
  addonsPersonalizeTitle: 'トレッキングをカスタマイズする方法',
  addonsSteps: [
    'あなたのペースに合わせて、1日の歩行時間・休憩・高度順応の進め方を調整できます。',
    'タトパニやガトランでの延泊、ゴサインクンド延長など、日程は柔軟にカスタマイズ可能です。',
    'グループ・家族・カップル・ソロすべてに対応し、人数や目的に合わせた最適プランをご提案します。',
  ],
  faqs: [
    {
      question: 'タマン・ヘリテージ＆ランタン谷トレッキングの難易度はどれくらいですか？',
      answer: textToLexical(
        '本トレックは中級レベルです。未経験者でも基礎体力があれば挑戦可能ですが、急登・急下降や1日5〜7時間の歩行があるため、事前の運動準備を推奨します。高所行動は体調に応じて調整できます。',
      ),
    },
    {
      question: 'このトレッキングのベストシーズンはいつですか？',
      answer: textToLexical(
        '最適時期は春（3月〜5月）と秋（9月〜11月）です。春は花と新緑、秋は安定した晴天と高い視界が魅力です。冬は静かな山歩き、雨季は緑が美しい一方で路面状況に注意が必要です。',
      ),
    },
    {
      question: 'タマン・ヘリテージ・ルートとランタン谷トレッキングの違いは何ですか？',
      answer: textToLexical(
        'タマン・ヘリテージは文化体験重視、ランタン谷は高所景観と山岳体験重視です。本パッケージは両方を統合しているため、文化・自然・冒険をバランスよく楽しめます。',
      ),
    },
    {
      question: 'ホームステイ体験とはどのようなものですか？',
      answer: textToLexical(
        'タマン族の家庭に宿泊し、地元の食事や暮らしを体験する滞在です。設備はシンプルですが清潔で、現地の人々との交流が旅の大きな魅力になります。',
      ),
    },
    {
      question: '高山病について教えてください。どうすれば防げますか？',
      answer: textToLexical(
        '十分な水分補給、無理のないペース、高度順応日程の順守が基本です。頭痛・吐き気・めまい等の症状が出た場合は即座にガイドへ相談し、必要に応じて下山します。',
      ),
    },
    {
      question: 'このトレッキングに必要な許可証は何ですか？',
      answer: textToLexical(
        'ランタン国立公園入園許可証とTIMSカードが必要です。本パッケージにはこれらの手続きと費用が含まれています。',
      ),
    },
    {
      question: 'トレッキング中の食事はどのようなものですか？',
      answer: textToLexical(
        'ティーハウスやホームステイで1日3食が提供されます。ダルバート、麺料理、モモ、チベットパンなどが中心で、高所ほどメニューは限定されます。',
      ),
    },
    {
      question: 'シャブルベシまでの移動はどのくらいかかりますか？',
      answer: textToLexical(
        'カトマンズから車で約7〜8時間です。トリスリ川沿いの景観を楽しみながら移動し、途中で適宜休憩を挟みます。',
      ),
    },
  ],
}

async function run() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'treks',
    where: {
      slug: {
        equals: trekSlug,
      },
    },
    depth: 0,
    limit: 1,
  })

  const existingDoc = existing.docs[0]

  if (existingDoc) {
    const updated = await payload.update({
      collection: 'treks',
      id: existingDoc.id,
      data: trekData as never,
    })

    console.log(`Updated trek: id=${existingDoc.id}, slug=${updated.slug ?? trekSlug}`)
    return
  }

  const created = await payload.create({
    collection: 'treks',
    data: trekData as never,
  })

  console.log(`Created trek: id=${created.id}, slug=${created.slug}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
