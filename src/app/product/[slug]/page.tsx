import { prismaClient } from "@/lib/prisma";
import ProductImages from "./components/product-images";
import ProductInfo from "./components/products-info";
import { computeProductTotalPrice } from "@/helpers/product";

interface IProductDeteilsPageProps {
  params: {
    slug: string;
  };
}

const ProductDetailsPage = async ({
  params: { slug },
}: IProductDeteilsPageProps) => {
  const product = await prismaClient.product.findFirst({
    where: {
      slug: slug,
    },
  });
  if (!product) return null;

  return (
    <div className="flex flex-col gap-8">
      <ProductImages imagesUrls={product.imageUrls} name={product.name} />
      <ProductInfo
        product={computeProductTotalPrice(product)}
        key={product.id}
      />
    </div>
  );
};

export default ProductDetailsPage;
