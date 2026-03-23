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

const trekSlug = 'everest-helicopter-tour-4hour-breakfast'

const trekData = {
  name: 'エベレスト・ヘリコプターツアー - 4時間フライト（朝食付き）',
  slug: trekSlug,
  days: '日帰り（約4時間）',
  difficulty: '初級' as const,
  price: 1399,
  image: 200, // TODO: replace with actual media ID
  gallery: [{ image: 201 }, { image: 202 }, { image: 203 }, { image: 204 }],
  maxAltitude: 'カラパタール 5,545m（18,192ft）',
  bestSeason: '通年（10〜11月・3〜4月が最適）',
  startEndPoint: 'カトマンズ / カトマンズ',
  trekAccommodation: 'なし（日帰りツアー）',
  trekMeals: '朝食（エベレストビューホテル・標高3,880m）',
  groupSize: '1〜5名',
  description:
    'トレッキング不要で1日でエベレストへ。カラパタール（5,545m）上空フライオーバーとエベレストビューホテルでの朝食が含まれた、カトマンズ発4時間の究極ヘリコプターツアーです。',
  overview: textToLexical(
    'エベレスト・ヘリコプターツアーは、14日間のトレッキングなしにわずか4時間でエベレスト（8,848m）を間近に体感できる、ネパール観光の最高の時間効率ルートです。早朝カトマンズを出発し、ルクラで給油してエベレスト・ベースキャンプ上空をフライオーバー。エベレストビューホテル（3,880m）での朝食がツアーのハイライトです。',
  ),
  detailedOverview: textToLexical(
    [
      'ヘリコプターはカトマンズ（1,400m）からルクラ（2,860m）を経由し、エベレスト・ベースキャンプ上空へと進みます。窓の外にはエベレスト（8,848m）・ローツェ（8,516m）・アマダブラム（6,812m）などのヒマラヤ連峰が広がり、クンブ氷河を眼下に見ながら飛行します。EBCトレッキングで14日間かけて歩くルートを空から一気に体感できるのも、このツアーだけの特別な視点です。',
      'シャンボチェのエベレストビューホテル（3,880m）はギネス認定「世界最高所の高級ホテル」。エベレストを正面に望むテラスで温かい朝食を楽しむ体験は、世界中どこを探しても代わりが見つからない贅沢なひとときです。',
    ].join('\n\n'),
  ),
  highlights: [
    {
      text: textToLexical(
        'カラパタール（5,545m）上空フライオーバー。エベレストに最も近い展望地点の上空から、エベレスト南壁・クンブ氷河・アイスフォールが広がる360°パノラマを体感します。',
      ),
    },
    {
      text: textToLexical(
        'エベレストビューホテルでの朝食（3,880m）。ギネス認定の世界最高所ホテルのテラスで、エベレストとアマダブラムを正面に眺めながら温かい朝食を楽しめます。',
      ),
    },
    {
      text: textToLexical(
        'エベレスト・ベースキャンプ（5,364m）上空フライオーバー。世界中の登山家が目指すEBCをヘリコプターから見下ろします。春（3〜5月）にはカラフルなテントが並ぶベースキャンプの様子も見えます。',
      ),
    },
    {
      text: textToLexical(
        'クンブ氷河・アイスフォール俯瞰。エベレスト登頂ルートの最難関エリアを安全なヘリの窓から観察。無数の氷塔（セラック）とクレバスが作り出す氷の迷宮を一望できます。',
      ),
    },
    {
      text: textToLexical(
        '8,000m峰の連峰空撮。エベレスト・ローツェ・マカルー・チョー・オユー・アマダブラムなどを1回のフライトで眺望。クンブ・ヒマールのスケールを空から実感できます。',
      ),
    },
    {
      text: textToLexical(
        'ルクラ（2,860m）立ち寄り。テンジン・ヒラリー空港のヘリパッドに着陸し、エベレストを目指す登山家やトレッカーが行き交うシェルパ族の村の活気を体感できます。',
      ),
    },
    {
      text: textToLexical(
        '日帰りエベレスト体験。朝5時30分にカトマンズを出発し、午前10時30分頃には帰着。短い滞在日数でもエベレストに会いに行ける、忙しい旅行者のための最高の選択肢です。',
      ),
    },
  ],
  itinerary: [
    {
      day: 1,
      title: 'カトマンズ → ルクラ → エベレスト上空 → エベレストビューホテル → カトマンズ',
      description: textToLexical(
        [
          '05:30 専用車でホテルお迎え。カトマンズ市内どのホテルからでもピックアップします。トリブバン国際空港の国内線ターミナルへ移動後、スタッフが搭乗手続きを代行。安全ブリーフィングを経て出発します。',
          '06:30 カトマンズ離陸。ヒマラヤ連峰を眺めながら東へ進み、約25分でルクラ（2,860m）に着陸。給油の15〜20分間はシェルパ族の村を散策できます。',
          '07:40 ルクラ離陸。ナムチェ・バザール・テンボチェ上空を飛行し、エベレスト・ベースキャンプ（5,364m）をフライオーバー。クンブ氷河の白銀の流れと8,000m峰の連なりが窓いっぱいに広がります。',
          '08:20 エベレストビューホテル（3,880m）着陸。エベレストを正面に望むテラスで約1時間の朝食タイム。スープ・卵料理・トースト・コーヒーなどが提供されます。',
          '09:30 エベレストビューホテル離陸。ルクラで給油後、カトマンズへ帰路につきます。',
          '10:30 カトマンズ着陸後、専用車でホテルまでお送りします。午後はカトマンズ市内観光にも余裕で間に合います。',
        ].join('\n\n'),
      ),
      elevation: 'カラパタール 5,545m（最高地点）',
      distance: '往復約400km（空路）',
      meals: ['breakfast'] as const,
      accommodation: 'なし（日帰りツアー）',
    },
  ],
  includes: [
    { text: textToLexical('往復ヘリコプターフライト（カトマンズ往復）') },
    { text: textToLexical('ホテル送迎（カトマンズ市内・専用車）') },
    { text: textToLexical('エベレストビューホテルでの朝食（3,880m）') },
    { text: textToLexical('カラパタール上空フライオーバー') },
    { text: textToLexical('サガルマータ国立公園入場許可証') },
    { text: textToLexical('クンブ・パサン・ラム地方自治体入域許可証') },
    { text: textToLexical('国内空港税・燃料費・着陸費用一切') },
    { text: textToLexical('緊急酸素ボンベ（機内常備）') },
    { text: textToLexical('航空保険') },
    { text: textToLexical('高所専門パイロット') },
    { text: textToLexical('全乗客へのウィンドウシート保証') },
  ],
  excludes: [
    { text: textToLexical('国際線航空運賃') },
    { text: textToLexical('ネパール観光ビザ料金') },
    { text: textToLexical('個人旅行保険（高所フライト対応保険を推奨）') },
    { text: textToLexical('アルコール・ソフトドリンク') },
    { text: textToLexical('チップ（推奨：$10〜20/人）') },
    { text: textToLexical('カトマンズ市内ホテル宿泊費') },
    { text: textToLexical('個人医療費') },
    { text: textToLexical('悪天候による追加宿泊・交通費') },
  ],
  addonsDescription: textToLexical(
    'ツアーをさらに充実させたい方のために追加オプションをご用意しています。ご希望に合わせて自由にカスタマイズできます。',
  ),
  addons: [
    {
      label: 'プライベート・チャーターへのアップグレード',
      description: textToLexical(
        '1〜2名での完全プライベートチャーターです。スケジュールを自由に組めるため、誕生日や記念日の特別演出にも最適です（1機あたり$4,900〜$5,500）。',
      ),
    },
    {
      label: 'ゴーキョ湖・ゴーキョリ（5,357m）追加オプション',
      description: textToLexical(
        'ゴーキョ谷のエメラルドグリーンの湖群と、4座の8,000m峰を望むゴーキョリを空から観察する追加ルートです。プライベートチャーターのみ対応可能（追加料金要相談）。',
      ),
    },
    {
      label: 'テンボチェ寺院（3,867m）立ち寄り',
      description: textToLexical(
        'エベレスト地域最大の仏教寺院テンボチェ・ゴンパに着陸します。アマダブラムを背景にした荘厳な寺院でのひとときは、山岳と文化が融合するネパールらしい体験です（プライベートチャーター・事前申請必要）。',
      ),
    },
    {
      label: 'EBCトレッキング帰路ヘリコプター',
      description: textToLexical(
        'EBCトレッキング完了後、ゴラクシェップやナムチェからカトマンズへのヘリ帰路手配が可能です。14日間歩いた後の「ご褒美フライト」はトレッカーの間で人気が高まっています（別途$350〜700/人）。',
      ),
    },
    {
      label: 'カトマンズ観光との組み合わせ',
      description: textToLexical(
        '午前のヘリツアー後、午後はパシュパティナート・ボダナート・スワヤンブナートを巡る半日観光を追加できます。エベレストとカトマンズの世界遺産を1日で体験できるお得なプランです。',
      ),
    },
  ],
  addonsPersonalizeTitle: 'ツアーをカスタマイズする方法',
  addonsSteps: [
    'プライベートチャーター・追加立ち寄りスポット・出発日など、ご希望をお気軽にご相談ください。',
    'ソロ・カップル・ファミリー・グループすべてに対応。5名超の場合は複数ヘリコプターを手配します。',
    '誕生日・婚約・記念日のサプライズ演出も承ります。ヘリ内でのケーキ・シャンパン手配も可能です。',
  ],
  faqs: [
    {
      question: 'ヘリコプターはエベレスト・ベースキャンプに着陸できますか？',
      answer: textToLexical(
        '現在、エベレスト・ベースキャンプへの商業ヘリコプター着陸は規制により禁止されています。グループ共有便はEBCを上空からフライオーバーし、エベレストビューホテル（3,880m）に着陸します。カラパタール着陸をご希望の場合は、プライベートチャーター（$4,900〜$5,500/機）をご検討ください。',
      ),
    },
    {
      question: '高山病のリスクはありますか？',
      answer: textToLexical(
        '高高度での滞在時間が短いため、深刻な高山病リスクは低いですが、軽い頭痛やめまいを感じる場合があります。機内には緊急酸素ボンベを常備しています。出発前にカトマンズで2〜3日滞在して高度に慣れておくことをお勧めします。',
      ),
    },
    {
      question: '悪天候でフライトがキャンセルになった場合は？',
      answer: textToLexical(
        '天候不良でフライトが中止になった場合、翌日以降への再スケジュール、または全額返金で対応します。国際線出発前日までに少なくとも1日の余裕を確保されることをお勧めします。',
      ),
    },
    {
      question: '防寒対策はどの程度必要ですか？',
      answer: textToLexical(
        'カラパタール付近は気温が−10°C〜−20°Cになることがあります。ダウンジャケット・防寒手袋・ビーニー帽・UVサングラスをお持ちください。ダウンジャケットはカトマンズのタメル地区でレンタル（約$3〜5/日）も可能です。',
      ),
    },
    {
      question: '体重制限はありますか？',
      answer: textToLexical(
        'ルクラ以降の高高度区間では重量制限があるため3名以下での飛行となり、グループ便の場合はフェリチェで分割シャトルを行います。体重が100kgを超える場合は追加費用が発生することがあります。',
      ),
    },
    {
      question: 'EBCトレッキングとヘリツアー、どちらがおすすめですか？',
      answer: textToLexical(
        'ネパール滞在が短い方や体力的にトレッキングが難しい方にはヘリツアーが最適です。シェルパ族の村や山岳文化をじっくり体験したい方はEBCトレッキング（12〜14日）をお勧めします。まずヘリツアーで全体像を掴んでから、次回にトレッキングという流れも多くの方に選ばれています。',
      ),
    },
    {
      question: 'どんなヘリコプターを使いますか？安全ですか？',
      answer: textToLexical(
        '主にAirbus H125（旧称AS350 B3）を使用します。高度6,000m以上での飛行実績を持つ山岳飛行向けの機種で、ヒマラヤ地域で広く採用されています。パイロットはネパール民間航空局認定の高所飛行専門資格を持ち、エベレスト地域での運航経験が豊富です。',
      ),
    },
  ],
}

async function run() {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'treks',
    where: { slug: { equals: trekSlug } },
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
