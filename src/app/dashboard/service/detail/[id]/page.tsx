'use client'

import { useParams } from 'next/navigation';

import ServiceDetailView from 'src/sections/service/service-detail/ServiceDetailView';


export default function ServiceDetail() {

    const { id } = useParams();

    return <ServiceDetailView id={id} />
}
