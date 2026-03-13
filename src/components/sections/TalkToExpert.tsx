import Image from 'next/image'

interface TalkToExpertProps {
  qrSrc?: string
  whatsapp?: string
  call?: string
}

export function TalkToExpert({
  qrSrc = '/images/contact-qr.jpg',
  whatsapp = '+9779849289569',
  call = '+08096321073',
}: TalkToExpertProps) {
  return (
    <div className="w-full p-3 rounded-lg outline outline-1 outline-slate-200/80 inline-flex flex-col justify-start items-start gap-2">
      <div className="self-stretch flex flex-col justify-start items-center gap-4">
        <div className="self-stretch text-center text-slate-950 text-base font-semibold">
          専門スタッフに相談
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-start items-center gap-3">
        {qrSrc && (
          <Image
            src={qrSrc}
            alt="専門スタッフに相談するためのQRコード"
            className="p-2.5"
            width={166}
            height={171}
          />
        )}
        <div className="self-stretch flex flex-col justify-start items-center gap-2">
          <div className="w-56 text-center">
            <span className="text-black text-sm font-medium">WhatsApp: </span>
            <span className="text-black text-base font-semibold">{whatsapp}</span>
          </div>
          <div className="self-stretch text-center">
            <span className="text-black text-sm font-medium">お電話: </span>
            <span className="text-black text-base font-semibold">{call}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
