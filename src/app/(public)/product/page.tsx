import Image from 'next/image';
import { Text } from '@radix-ui/themes';
export default function ProductPage() {
  return (
    <>
      <div className="bg-black  flex-col  p-4 ">
        <div className=" items-center flex">
          <Image
            src={'https://picsum.photos/id/219/200/300'}
            width={'200'}
            height={'200'}
            alt="Image Alternate text"
          ></Image>
        </div>

        <div className="flex flex-row justify-between p-4 ">
          <h3 className="">Title</h3>
          <h3>Price</h3>
        </div>

        <div>
          <Text>Size</Text>
          <div className="flex text-white gap-4 ">
            <a href="">*</a>
            <a href="">*</a>
            <a href="">*</a>
            <a href="">*</a>
          </div>
        </div>
        <div>Return</div>
      </div>
    </>
  );
}
