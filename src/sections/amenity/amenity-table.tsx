import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_Row,
    createMRTColumnHelper,
  } from 'material-react-table';
  import { useState } from 'react';
  
  import { Box, Button, Chip, Menu, MenuItem } from '@mui/material';
  import FileDownloadIcon from '@mui/icons-material/FileDownload';
  import { mkConfig, generateCsv, download } from 'export-to-csv';
  import { UserManagement } from 'src/types/users';
  import { useCurrentRole ,useCurrentAmenity} from 'src/zustand/store';
  import AmenityMenu from './amenity-menu';
  import Image from 'next/image';
  const columnHelper = createMRTColumnHelper<UserManagement | any>();
  
  const statusOption = ['Từ chối','Xét duyệt', 'Chấp thuận' ];
  
  const AmenityTable = (props: any) => {
    const { data = [] } = props;
    const { updateAmenityZustand } = useCurrentAmenity();
  
    const columns = [
      columnHelper.accessor('name', {
        header: ' Tên',
        size: 220,
        Cell: ({ cell }) => {
            let rowData=cell.row.original
            return (<>
            <div style={{display:'flex', gap:10}}>
                <div>
                    <Image src={rowData.iconPath} alt='' width={30} height={30}/>

                </div>
                <div style={{display:'flex',alignItems:'center'}}>
                {cell.getValue()}
          
            
                </div>
            </div>
            
            </>)
        },
      }),
      
  
      columnHelper.accessor('iconType', {
        header: 'Loại',
        size: 220,
        Cell: ({ cell }) => <span>{cell.getValue() == null ? 'none' : cell.getValue()}</span>,
      }),
      columnHelper.accessor('iconPath', {
        header: 'Đường dẫn',
        size: 220,
        Cell: ({ cell }) => <span>{cell.getValue() == null ? 'none' : cell.getValue()}</span>,
      }),
      columnHelper.accessor('iconSize', {
        header: 'kích thước',
        size: 220,
        Cell: ({ cell }) => <span>{cell.getValue() == null ? 'none' : cell.getValue()}</span>,
      }),
  
  
      columnHelper.accessor('status', {
        header: 'Trạng thái',
        size: 210,
        Cell: ({ cell }) => (
          <span> 
               {cell.getValue() ==0 && <Chip label={statusOption[0]}  variant='soft' color="error" />}
              {cell.getValue() == 1 && <Chip label={statusOption[1]} variant='soft' color="warning" />}
              {cell.getValue() == 2 && <Chip label={statusOption[2]} variant='soft' color="success" />}
          
          </span>
        ),
      }),
  
      columnHelper.accessor('action', {
        header: 'Hành động ',
        size: 220,
        Cell: ({ cell }) => (
          <span
            onClick={(e) => {
             updateAmenityZustand(cell.row.original);
            }}
          >
            <AmenityMenu />
          </span>
        ),
      }),
    ];
  
    const csvConfig = mkConfig({
      fieldSeparator: ',',
      decimalSeparator: '.',
      useKeysAsHeaders: true,
    });
  
  
    const table = useMaterialReactTable({
      columns,
      data,
      enableRowSelection: false,
      columnFilterDisplayMode: 'popover',
      paginationDisplayMode: 'pages',
      positionToolbarAlertBanner: 'bottom',
      
    });
  
    return (
      <>
        <MaterialReactTable table={table} />
      </>
    );
  };
  
  export default AmenityTable;
  