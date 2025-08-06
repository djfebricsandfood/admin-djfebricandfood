import { useState, useCallback } from 'react';

import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import useGetAllProducts from '../http/useGetAllProducts';
import useGetDeleteProductMutation from '../http/useGetDeleteProductMutation';

// ----------------------------------------------------------------------

export function ProductListView() {
  const confirmDialog = useBoolean();
  const router = useRouter();
  const { data, isLoading } = useGetAllProducts();

  const { mutateAsync, isPending } = useGetDeleteProductMutation()

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);

  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    productsPerPage: 10,
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = products.map((product: any) => product._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    // Here you would typically fetch new data for the page
    // For now, we're just using client-side pagination
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteRow = useCallback(
    (id: string) => {

      // Then refetch the data
      mutateAsync(id);
    },
    [mutateAsync]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = products.filter((product: any) => !selected.includes(product._id));
    toast.success('Delete success!');
    // Here you would typically call an API to delete the selected products
    // Then refetch the data
    // mutate();a
    setSelected([]);
    confirmDialog.onFalse();
  }, [selected, products, confirmDialog]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.product.details(id));
    },
    [router]
  );

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Products"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Products', href: paths.dashboard.product.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Product
            </Button>
          }
          sx={{ mb: 3 }}
        />

        <Card>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>S.NO.</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Variants</TableCell>
                  <TableCell>Images</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any, index) => {
                    const selectedRow = selected.indexOf(row._id) !== -1;
                    return (
                      <TableRow
                        hover
                        key={row._id}
                        selected={selectedRow}
                        onClick={(event) => handleClick(event, row._id)}
                      >

                        <TableCell>
                          <Typography variant="subtitle2">{index + 1}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="subtitle2">{row.name}</Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(row.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {row.subProducts?.length || 0}
                        </TableCell>
                        <TableCell>
                          {row.images?.length || 0}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton
                              color="info"
                              onClick={() => handleViewRow(row._id)}
                            >
                              <Iconify icon="solar:eye-bold" />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() => handleEditRow(row._id)}
                            >
                              <Iconify icon="solar:pen-bold" />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteRow(row._id)}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={pagination.totalProducts}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Confirm Delete"
        content={
          <>
            Are you sure you want to delete <strong>{selected.length}</strong> products?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRows}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// You'll need to add this Checkbox component if not already imported
function Checkbox({ indeterminate, checked, onChange, ...rest }: any) {
  return (
    <input
      type="checkbox"
      style={{ width: 16, height: 16 }}
      ref={(el) => {
        if (el) {
          el.indeterminate = indeterminate;
        }
      }}
      checked={checked}
      onChange={onChange}
      {...rest}
    />
  );
}