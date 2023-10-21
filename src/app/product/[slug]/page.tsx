import { prismaClient } from "@/lib/prisma";
import ProductImages from "./components/product-images";
import ProductInfo from "./components/products-info";
import { computeProductTotalPrice } from "@/helpers/product";
import ProductList from "@/components/ui/product-list";

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
    include: {
      category: {
        include: {
          products: {
            where: {
              slug: {
                not: slug,
              },
            },
          },
        },
      },
    },
  });

  if (!product) return null;

  return (
    <div className="flex flex-col gap-8 pb-8">
      <ProductImages imagesUrls={product.imageUrls} name={product.name} />
      <ProductInfo
        product={computeProductTotalPrice(product)}
        key={product.id}
      />
      <ProductList products={product.category.products} />
    </div>
  );
};

export default ProductDetailsPage;
