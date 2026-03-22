import React from 'react'

const Map = () => {
  return (
    <div className="w-full h-[400px] sm:h-[250px] md:h-[300px] lg:h-[400px] 2xl:h-[500px] rounded-lg overflow-hidden shadow-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28255.315329803325!2d85.2852129936218!3d27.71992860573394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1948bae102c3%3A0x6712ed2c3930308d!2sYama%20Nepal%20Trek%20%26%20Expedition%20Pvt.Ltd!5e0!3m2!1sen!2snp!4v1774151132168!5m2!1sen!2snp"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Easy Shifting and Fitting Location - Bagbazar, Kathmandu"
      />
    </div>
  )
}

export default Map
