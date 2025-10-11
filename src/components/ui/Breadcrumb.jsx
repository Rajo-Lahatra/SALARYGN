import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();

  const routeLabels = {
    '/dashboard': 'Tableau de Bord',
    '/employee-tax-calculator': 'Calcul Individuel',
    '/employee-management': 'Gestion Employés',
    '/batch-processing': 'Traitement par Lot',
    '/tax-settings': 'Paramètres Fiscaux'
  };

  const generateBreadcrumbs = () => {
    if (customItems) return customItems;

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Accueil', path: '/dashboard' }];

    let currentPath = '';
    pathSegments?.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = routeLabels?.[currentPath] || segment?.charAt(0)?.toUpperCase() + segment?.slice(1);
      
      if (currentPath !== '/dashboard') {
        breadcrumbs?.push({ label, path: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm font-body mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((item, index) => (
          <li key={item?.path} className="flex items-center">
            {index > 0 && (
              <Icon
                name="ChevronRight"
                size={16}
                className="text-muted-foreground mx-2"
              />
            )}
            {index === breadcrumbs?.length - 1 ? (
              <span
                className="text-foreground font-medium"
                aria-current="page"
              >
                {item?.label}
              </span>
            ) : (
              <Link
                to={item?.path}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item?.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;