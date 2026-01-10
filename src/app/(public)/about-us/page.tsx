import React from 'react';

const AboutUsPage = () => {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl text-gray-900 font-sans">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 uppercase tracking-wide border-b-2 border-transparent hover:border-black transition-all inline-block w-full">
                About Us
            </h1>

            <div className="space-y-6 text-base md:text-lg leading-relaxed text-justify">
                <p>
                    At MALICC, we don't just create clothing—we create experiences that redefine your style journey. Founded with a passion for
                    impeccable design, quality craftsmanship, and a relentless drive to empower self-expression, MALICC has rapidly emerged as a
                    leader in fashion that celebrates versatility, inclusivity, and individuality.
                </p>

                <p>
                    Our journey began with one simple belief: that fashion should empower everyone, allowing them to feel confident, comfortable,
                    and authentic in their clothing. From the start, we set out to craft a collection that blends timeless style with modern sophistication
                    —offering everything from classic shirts, tailored trousers, and denim, to statement accessories and contemporary outerwear.
                    Today, we are proud to offer a full range of apparel designed for people of all tastes, sizes, and lifestyles.
                </p>

                <p>
                    As a Direct-to-Consumer (D2C) brand, we're all about creating a direct connection with our customers. By cutting out the
                    middleman, we ensure that you receive the best possible value for your fashion purchases. Our online presence allows us to offer
                    a seamless shopping experience, with a user-friendly interface, secure payment options, and personalized customer service.
                    Whether you're shopping from the comfort of your home or on the go via our app, you're guaranteed an easy, enjoyable journey
                    to discovering your next wardrobe essential.
                </p>

                <p>
                    But our commitment to style goes beyond just the digital space. We are excited to expand our presence with physical stores
                    across the region, bringing the MALICC experience to cities nationwide. From bustling metropolitan hubs to quieter suburban
                    locations, our growing network of stores offers our customers a chance to see, feel, and experience our collections in person.
                    Whether you're stopping by for a quick wardrobe refresh or browsing through our latest arrivals, our stores offer a curated
                    shopping experience designed to inspire and engage you.
                </p>

                <p>
                    At MALICC, we understand that fashion isn't one-size-fits-all, and that's why inclusivity is at the heart of our brand. We're proud
                    to offer a range of clothing that's designed to fit all body types, including our recently launched plus-size collection. Our plus-size
                    range features everything from stylish shirts and t-shirts to well-fitted jeans and trendy cargo pants, all designed to ensure
                    comfort without compromising on style. We believe that everyone deserves clothing that not only fits but makes them feel their
                    absolute best, no matter their size.
                </p>

                <p>
                    What sets us apart is our attention to detail and our commitment to providing our customers with products that go beyond just
                    meeting expectations. Our design team works tirelessly to stay ahead of trends while maintaining the integrity of classic,
                    versatile pieces. We're not just focused on looks—each garment is carefully constructed with premium fabrics to provide
                    durability and comfort, because we know that a true investment in fashion is one that lasts.
                </p>

                <p>
                    Our collections reflect the dynamic and diverse needs of today's individual. Whether you're looking for workwear that transitions easily
                    to after-hours, or casual weekend attire that's both stylish and comfortable, MALICC has you covered. We also offer a wide
                    selection of accessories, from belts and bags to hats and scarves, ensuring that every aspect of your outfit speaks to your
                    personality.
                </p>

                <p>
                    Beyond fashion, we are creating a community of like-minded individuals who value quality, craftsmanship, and personal
                    expression. Our social media platforms, app, and website provide a space for our customers to connect, share their looks, and
                    engage with the brand in a way that's genuine and authentic. We believe that style is about more than just the clothes you wear
                    —it's about the attitude you embody and the way you carry yourself. That's why MALICC is not just a brand; it's a lifestyle.
                </p>

                <p>
                    As we continue to expand our presence, both online and offline, our promise remains the same: to offer you high-quality, stylish
                    apparel that fits your personality, lifestyle, and values. We're here to help you build a wardrobe that empowers you to look and
                    feel your best—whether you're suiting up for a big day at work or relaxing on a weekend getaway.
                </p>

                <p>
                    Thank you for being part of the MALICC family. We look forward to continuing this exciting journey with you, delivering not just
                    great clothing, but a shopping experience that's as unique as you are.
                </p>

                <p className="font-medium mt-8">
                    Welcome to MALICC—where style meets purpose, and everyone can express their individuality.
                </p>
            </div>

            <div className="mt-16 border-t border-gray-300 pt-8 flex flex-col md:flex-row justify-between gap-10 text-sm md:text-base text-gray-800">
                <div>
                    <h3 className="font-bold uppercase tracking-wider mb-2 text-lg">MALICC Apparels Private Limited</h3>
                    <div className="space-y-1">
                        <p className="font-semibold">Registered Office Address</p>
                        <p>No 1/1, 1st, 2nd, 3rd, 4th, 5th Floors, St. Johns Church</p>
                        <p>Road, Bharathinagar, Fraser Town,</p>
                        <p>India - 560005</p>
                        <p className="font-semibold mt-4">CIN: U18109KA2022PTC163969</p>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold mb-2 text-lg">Contact details:</h3>
                    <div className="space-y-1">
                        <p><span className="font-semibold">Name:</span> John</p>
                        <p><span className="font-semibold">Designation:</span> Lead Head</p>
                        <p><span className="font-semibold">Email:</span> john@malicc.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
