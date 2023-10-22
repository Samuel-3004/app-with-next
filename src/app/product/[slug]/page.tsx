import { prismaClient } from "@/lib/prisma";
import ProductImages from "./components/product-images";
import ProductInfo from "./components/products-info";
import { computeProductTotalPrice } from "@/helpers/product";
import ProductList from "@/app/(home)/components/product-list";
import SectionTitle from "@/app/(home)/components/section-title";

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
      <div>
        <SectionTitle>Produtos recomendados</SectionTitle>
        <ProductList products={product.category.products} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
